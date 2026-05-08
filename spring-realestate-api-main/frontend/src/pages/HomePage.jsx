import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection.jsx'
import PropertyCard from '../components/PropertyCard.jsx'
import Alert from '../components/Alert.jsx'
import StatsSection from '../components/StatsSection.jsx'
import Testimonials from '../components/Testimonials.jsx'
import CTASection from '../components/CTASection.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { fetchProperties } from '../services/properties.js'

function HomePage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchProperties()
        const list = Array.isArray(data) ? data : data?.content || []
        if (!cancelled) setProperties(list)
      } catch (err) {
        if (!cancelled)
          setError(
            err.response?.data?.message || 'Failed to load featured properties.',
          )
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const featured = useMemo(() => properties.slice(0, 6), [properties])

  return (
    <div className="w-full space-y-12">
      <HeroSection />

      <StatsSection />

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Featured properties
            </h2>
            <p className="text-sm text-slate-600">
              Handpicked premium listings from top Indore localities.
            </p>
          </div>
          <Link
            to="/properties"
            className="text-sm font-semibold text-primary-700 transition hover:text-primary-800"
          >
            Explore all
          </Link>
        </div>

        {error ? <Alert type="error">{error}</Alert> : null}

        {loading ? (
          <LoadingSkeleton count={6} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
            {!featured.length ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState message="No featured listings yet. Add properties from dashboard to display them here." />
              </div>
            ) : null}
          </motion.div>
        )}
      </section>

      <Testimonials />

      <CTASection />
    </div>
  )
}

export default HomePage


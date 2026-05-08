import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard.jsx'
import Alert from '../components/Alert.jsx'
import Input from '../components/Input.jsx'
import EmptyState from '../components/EmptyState.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import CategoryChips from '../components/CategoryChips.jsx'
import { fetchProperties } from '../services/properties.js'

const TYPES = [
  { label: 'All', value: '' },
  { label: 'Rent', value: 'rent' },
  { label: 'Sale', value: 'sale' },
]

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Plot', value: 'plot' },
]

function normalize(str) {
  return (str || '').toString().trim().toLowerCase()
}

function PropertiesPage() {
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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
          setError(err.response?.data?.message || 'Failed to load properties.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const nq = normalize(q)
    const nt = normalize(type)
    const nc = normalize(category)

    const nMin = minPrice === '' ? null : Number(minPrice)
    const nMax = maxPrice === '' ? null : Number(maxPrice)

    const list = properties.filter((p) => {
      const haystack = normalize(
        [p.title, p.name, p.location, p.city, p.state, p.description].join(' '),
      )

      const matchesQ = !nq || haystack.includes(nq)
      const matchesType = !nt || normalize(p.type) === nt
      const matchesCategory = !nc || normalize(p.category) === nc
      const price = Number(p.price) || 0
      const matchesMin = nMin == null || price >= nMin
      const matchesMax = nMax == null || price <= nMax
      return matchesQ && matchesType && matchesCategory && matchesMin && matchesMax
    })

    if (sortBy === 'priceLowToHigh') {
      return [...list].sort((a, b) => (a.price || 0) - (b.price || 0))
    }
    if (sortBy === 'priceHighToLow') {
      return [...list].sort((a, b) => (b.price || 0) - (a.price || 0))
    }
    return list
  }, [properties, q, type, category, sortBy, minPrice, maxPrice])

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Properties
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse premium Indore listings with advanced filters.
          </p>
        </div>
        <div className="text-sm text-slate-600">
          Showing <span className="font-semibold">{filtered.length}</span> of{' '}
          <span className="font-semibold">{properties.length}</span>
        </div>
      </div>

      <div className="section-shell grid gap-4 p-4 md:grid-cols-6">
        <div className="md:col-span-2">
          <Input
            label="Search"
            value={q}
            placeholder="Vijay Nagar, AB Road, Nipania..."
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <label className="block md:col-span-1">
          <div className="mb-1 text-sm font-medium text-slate-700">Type</div>
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-1">
          <div className="mb-1 text-sm font-medium text-slate-700">
            Category
          </div>
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-1">
          <div className="mb-1 text-sm font-medium text-slate-700">Sort</div>
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Recommended</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
        </label>
        <Input
          label="Min Price (₹)"
          type="number"
          value={minPrice}
          placeholder="e.g. 3000000"
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          label="Max Price (₹)"
          type="number"
          value={maxPrice}
          placeholder="e.g. 9000000"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CategoryChips
          onPick={(chip) => {
            const val = chip.toLowerCase()
            if (val === 'rent' || val === 'sale') setType(val)
            else setCategory(val)
          }}
        />
        <button
          type="button"
          onClick={() => {
            setQ('')
            setType('')
            setCategory('')
            setSortBy('default')
            setMinPrice('')
            setMaxPrice('')
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
        >
          Clear filters
        </button>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
          {!filtered.length ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState />
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default PropertiesPage


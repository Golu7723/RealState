import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner.jsx'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import PropertyCard from '../components/PropertyCard.jsx'
import { fetchProperties, fetchPropertyById } from '../services/properties.js'
import { contactAgent } from '../services/contact.js'
import { formatInrPrice } from '../utils/property.js'
import { useAuth } from '../context/AuthContext.jsx'
import { createBooking } from '../services/bookings.js'
import { createSaleInquiry } from '../services/inquiries.js'

function PropertyDetailsPage() {
  const { isAuthenticated } = useAuth()
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [contactState, setContactState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactMsg, setContactMsg] = useState(null)
  const [actionMsg, setActionMsg] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPropertyById(id)
        if (!cancelled) setProperty(data)
        const all = await fetchProperties()
        if (!cancelled) {
          const currentCategory = (data?.category || '').toLowerCase()
          const related = all
            .filter((item) => String(item.id) !== String(id))
            .filter((item) =>
              currentCategory ? (item.category || '').toLowerCase() === currentCategory : true,
            )
            .slice(0, 3)
          setSimilar(related)
        }
      } catch (err) {
        if (!cancelled)
          setError(err.response?.data?.message || 'Failed to load property.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const imageUrl = useMemo(() => {
    return (
      property?.imageUrl ||
      property?.image ||
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=70'
    )
  }, [property])
  const fallback =
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=70'

  const gallery = useMemo(() => {
    const images = [imageUrl]
    return images.filter(Boolean)
  }, [imageUrl])

  useEffect(() => {
    setActiveImage(imageUrl)
  }, [imageUrl])

  const submitContact = async (e) => {
    e.preventDefault()
    setContactLoading(true)
    setContactMsg(null)
    try {
      await contactAgent({
        propertyId: id,
        ...contactState,
      })
      setContactMsg({ type: 'success', text: 'Message sent to agent.' })
      setContactState({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setContactMsg({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Failed to send message. Please try again.',
      })
    } finally {
      setContactLoading(false)
    }
  }

  const onQuickBooking = async () => {
    try {
      await createBooking({
        propertyId: Number(id),
        bookingType: 'RENTAL',
        startDate: new Date().toISOString().split('T')[0],
      })
      setActionMsg({ type: 'success', text: 'Booking request created successfully.' })
    } catch (e) {
      setActionMsg({ type: 'error', text: e.response?.data?.detail || 'Booking request failed.' })
    }
  }

  const onQuickInquiry = async () => {
    try {
      await createSaleInquiry({
        propertyId: Number(id),
        offeredAmount: Number(property.price || 1),
        tokenAmount: 1000,
        message: `Interested in property #${id}`,
      })
      setActionMsg({ type: 'success', text: 'Sale inquiry created successfully.' })
    } catch (e) {
      setActionMsg({ type: 'error', text: e.response?.data?.detail || 'Sale inquiry failed.' })
    }
  }

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-14">
        <Spinner className="h-7 w-7" />
      </div>
    )
  }

  if (error) return <Alert type="error">{error}</Alert>

  if (!property) return <Alert type="error">Property not found.</Alert>

  return (
    <div className="w-full space-y-6">
      <div className="text-sm text-slate-600">
        <Link to="/properties" className="font-semibold text-primary-700">
          ← Back to properties
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.06)]">
            <div className="aspect-[16/9] bg-slate-100">
              <img
                src={activeImage || imageUrl || fallback}
                alt={property.title || property.name || 'Property'}
                className="h-full w-full object-cover"
                onError={() => setActiveImage(fallback)}
              />
            </div>
            <div className="flex gap-3 overflow-x-auto px-6 pt-4">
              {gallery.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={[
                    'h-16 w-24 shrink-0 overflow-hidden rounded-xl border',
                    activeImage === img ? 'border-indigo-500' : 'border-slate-200',
                  ].join(' ')}
                >
                  <img src={img} alt={`Property view ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {property.title || property.name || 'Property'}
                  </h1>
                  <div className="mt-1 text-sm text-slate-600">
                    {property.location ||
                      [property.city, property.state].filter(Boolean).join(', ')}
                  </div>
                </div>
                <div className="rounded-2xl bg-primary-50 px-4 py-3">
                  <div className="text-xs font-semibold text-primary-700">
                    Price
                  </div>
                  <div className="text-xl font-extrabold text-primary-800">
                    {formatInrPrice(property.price, property.type, property.priceLabel)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                  {property.badge || ((property.type || 'sale') === 'rent' ? 'For Rent' : 'For Sale')}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                  {property.category || 'Residential'}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-500">
                    Bedrooms
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    {property.beds ?? property.bedrooms ?? '—'}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-500">
                    Bathrooms
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    {property.baths ?? property.bathrooms ?? '—'}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-500">
                    Area
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    {property.area ?? property.sqft ?? '—'}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  About this property
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  {property.description ||
                    'No description provided for this listing.'}
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(property.amenities || []).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Location</h2>
                <p className="mt-2 text-sm text-slate-600">{property.location}</p>
              </div>
              {isAuthenticated ? (
                <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                  <Button onClick={onQuickBooking}>Request Booking</Button>
                  <Button variant="secondary" onClick={onQuickInquiry}>
                    Send Sale Inquiry
                  </Button>
                </div>
              ) : (
                <Alert type="info">Login to create bookings and sale inquiries.</Alert>
              )}
              {actionMsg ? <Alert type={actionMsg.type}>{actionMsg.text}</Alert> : null}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)]">
            <div className="text-base font-bold text-slate-900">
              Contact agent
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Ask for availability, viewing, or more details.
            </p>
            <form className="mt-4 space-y-3" onSubmit={submitContact}>
              <Input
                label="Your name"
                value={contactState.name}
                onChange={(e) =>
                  setContactState((s) => ({ ...s, name: e.target.value }))
                }
                required
              />
              <Input
                label="Email"
                type="email"
                value={contactState.email}
                onChange={(e) =>
                  setContactState((s) => ({ ...s, email: e.target.value }))
                }
                required
              />
              <Input
                label="Phone (optional)"
                value={contactState.phone}
                onChange={(e) =>
                  setContactState((s) => ({ ...s, phone: e.target.value }))
                }
              />
              <label className="block">
                <div className="mb-1 text-sm font-medium text-slate-700">
                  Message
                </div>
                <textarea
                  className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  value={contactState.message}
                  onChange={(e) =>
                    setContactState((s) => ({ ...s, message: e.target.value }))
                  }
                  placeholder="Hi, I’m interested in this property. Is it still available?"
                  required
                />
              </label>

              {contactMsg ? (
                <Alert type={contactMsg.type}>{contactMsg.text}</Alert>
              ) : null}

              <Button type="submit" disabled={contactLoading} className="w-full">
                {contactLoading ? 'Submitting…' : 'Submit Inquiry'}
              </Button>
            </form>
          </div>
        </aside>
      </div>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Similar properties
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {similar.map((item) => (
            <PropertyCard key={item.id} property={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default PropertyDetailsPage


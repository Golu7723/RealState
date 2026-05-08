import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { formatInrPrice } from '../utils/property.js'

function PropertyCard({ property }) {
  const fallback = 'https://images.unsplash.com/photo-1560185008-5bf9cdb0c41a?auto=format&fit=crop&w=1200&q=70'
  const initialImg = useMemo(
    () => property?.imageUrl || property?.image || fallback,
    [property],
  )
  const [imgSrc, setImgSrc] = useState(initialImg)
  useEffect(() => {
    setImgSrc(initialImg)
  }, [initialImg])

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(2,6,23,0.12)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          alt={property.title || property.name || 'Property'}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          onError={() => setImgSrc(fallback)}
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
          {property.badge || ((property.type || 'sale') === 'rent' ? 'For Rent' : 'For Sale')}
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-slate-700 backdrop-blur transition hover:text-rose-500"
          aria-label="Save property"
        >
          ♥
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-3">
          <div className="text-lg font-bold text-white">
            {formatInrPrice(property.price, property.type, property.priceLabel)}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-slate-900">
              {property.title || property.name || 'Beautiful home'}
            </div>
            <div className="mt-1 truncate text-sm text-slate-600">
              {property.location ||
                [property.city, property.state].filter(Boolean).join(', ') ||
                'Prime location'}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="mt-1 text-xs text-slate-500">
              {property.category || 'Residential'}
            </div>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
          {property.shortDescription || property.description || 'Premium listing in Indore.'}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600">
          <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
            <div className="font-semibold text-slate-900">
              {property.beds ?? property.bedrooms ?? '—'}
            </div>
            <div>Beds</div>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
            <div className="font-semibold text-slate-900">
              {property.baths ?? property.bathrooms ?? '—'}
            </div>
            <div>Baths</div>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
            <div className="font-semibold text-slate-900">
              {property.area ?? property.sqft ?? '—'}
            </div>
            <div>Sqft</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard


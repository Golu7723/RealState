import { indoreProperties } from '../data/indoreProperties.js'

const backupImages = indoreProperties.map((item) => item.image).filter(Boolean)

const realisticTemplates = [
  {
    title: '2 BHK Apartment in Vijay Nagar',
    location: 'Vijay Nagar, Indore, Madhya Pradesh',
    shortDescription: 'Near shopping hubs with strong rental and resale demand.',
  },
  {
    title: '3 BHK Villa in Scheme No 140',
    location: 'Scheme No 140, Indore, Madhya Pradesh',
    shortDescription: 'Premium gated community living with wide internal roads.',
  },
  {
    title: 'Commercial Office Space on AB Road',
    location: 'AB Road, Indore, Madhya Pradesh',
    shortDescription: 'Road-facing office inventory in a high-footfall corridor.',
  },
  {
    title: 'Residential Plot in Super Corridor',
    location: 'Super Corridor, Indore, Madhya Pradesh',
    shortDescription: 'High-growth investment zone near major institutions.',
  },
  {
    title: '1 BHK Rental Flat in Palasia',
    location: 'Palasia, Indore, Madhya Pradesh',
    shortDescription: 'Ideal rental option for young working professionals.',
  },
]

function getTemplateById(id) {
  const str = String(id ?? '')
  let hash = 0
  for (let i = 0; i < str.length; i += 1) hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  return realisticTemplates[hash % realisticTemplates.length]
}

function getBackupImageById(id) {
  if (!backupImages.length) return null
  const str = String(id ?? '')
  let hash = 0
  for (let i = 0; i < str.length; i += 1) hash = (hash * 37 + str.charCodeAt(i)) >>> 0
  return backupImages[hash % backupImages.length]
}

function resolveImageUrl(rawImage) {
  const image = (rawImage || '').toString().trim()
  if (!image) return null
  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('//')) return `https:${image}`
  if (image.startsWith('/')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api/v1'
    const backendOrigin = apiBase.replace(/\/api\/v\d+\/?$/, '')
    return `${backendOrigin}${image}`
  }
  return image
}

export function normalizeProperty(raw) {
  if (!raw) return null
  const template = getTemplateById(raw.id)
  const title = (raw.title || raw.name || '').toString().trim()
  const location =
    (raw.location || [raw.locality, raw.city, raw.state].filter(Boolean).join(', ')).trim()
  const isGenericTitle = !title || /^(property listing|listing)$/i.test(title)
  const isGenericLocation = !location || /^dealer street/i.test(location)
  const image = resolveImageUrl(raw.imageUrl || raw.image) || getBackupImageById(raw.id)

  return {
    ...raw,
    id: raw.id,
    title: isGenericTitle ? template.title : title,
    location: isGenericLocation ? template.location : location,
    image,
    type: (raw.type || 'sale').toString().toLowerCase(),
    category: (raw.category || 'apartment').toString().toLowerCase(),
    bedrooms: raw.bedrooms ?? raw.beds ?? 0,
    bathrooms: raw.bathrooms ?? raw.baths ?? 0,
    area: raw.area ?? raw.sqft ?? 0,
    amenities: raw.amenities || [],
    badge:
      raw.badge || ((raw.type || '').toString().toLowerCase() === 'rent' ? 'For Rent' : 'For Sale'),
    shortDescription: raw.shortDescription || raw.description || template.shortDescription,
  }
}

export function normalizeList(items) {
  return (Array.isArray(items) ? items : []).map(normalizeProperty).filter(Boolean)
}

export function getFallbackProperties() {
  return normalizeList(indoreProperties)
}

export function getPropertyByIdFallback(id) {
  return normalizeProperty(indoreProperties.find((item) => String(item.id) === String(id)))
}

export function formatInrPrice(value, type = 'sale', priceLabel) {
  if (priceLabel) return priceLabel
  const num = Number(value)
  if (Number.isNaN(num) || !Number.isFinite(num) || num <= 0) {
    return 'Price on request'
  }

  if (type === 'rent') {
    return `₹${num.toLocaleString('en-IN')}/month`
  }

  if (num >= 10000000) {
    const cr = num / 10000000
    return `₹${Number(cr.toFixed(2)).toString().replace(/\.0+$/, '')} Cr`
  }
  if (num >= 100000) {
    const lac = num / 100000
    return `₹${Number(lac.toFixed(2)).toString().replace(/\.0+$/, '')} Lac`
  }
  return `₹${num.toLocaleString('en-IN')}`
}

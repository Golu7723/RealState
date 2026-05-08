import api from './api.js'
import {
  getFallbackProperties,
  getPropertyByIdFallback,
  normalizeList,
  normalizeProperty,
} from '../utils/property.js'

export async function fetchProperties() {
  try {
    const res = await api.get('/dealer/properties/')
    const list = Array.isArray(res.data) ? res.data : res.data?.content || []
    const normalized = normalizeList(list)
    return normalized.length ? normalized : getFallbackProperties()
  } catch {
    return getFallbackProperties()
  }
}

export async function fetchPropertyById(id) {
  try {
    const res = await api.get(`/properties/${id}`)
    return normalizeProperty(res.data) || getPropertyByIdFallback(id)
  } catch {
    return getPropertyByIdFallback(id)
  }
}

export async function createProperty(payload) {
  const formData = new FormData()
  formData.append('request', JSON.stringify(payload))
  // If there are images, append them, but for now, empty array
  formData.append('images', new Blob([], { type: 'application/octet-stream' }))
  const res = await api.post('/dealer/property/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

export async function updateProperty(id, payload) {
  const formData = new FormData()
  formData.append('request', JSON.stringify(payload))
  // If there are images, append them, but for now, empty array
  formData.append('images', new Blob([], { type: 'application/octet-stream' }))
  const res = await api.put(`/dealer/property/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

export async function deleteProperty(id) {
  const res = await api.delete(`/dealer/property/${id}`)
  return res.data
}


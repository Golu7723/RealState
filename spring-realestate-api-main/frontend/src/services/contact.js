import api from './api.js'

export async function contactAgent(payload) {
  const res = await api.post('/contact', payload)
  return res.data
}


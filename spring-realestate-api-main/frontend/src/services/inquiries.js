import api from './api'

export async function createSaleInquiry(payload) {
  const res = await api.post('/sale-inquiries', payload)
  return res.data
}

export async function fetchMySaleInquiries() {
  const res = await api.get('/sale-inquiries/me')
  return res.data
}

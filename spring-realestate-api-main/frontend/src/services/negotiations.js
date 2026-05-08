import api from './api'

export async function fetchNegotiationMessages(inquiryId) {
  const res = await api.get(`/negotiations/${inquiryId}/messages`)
  return res.data
}

export async function sendNegotiationMessage(inquiryId, payload) {
  const res = await api.post(`/negotiations/${inquiryId}/messages`, payload)
  return res.data
}

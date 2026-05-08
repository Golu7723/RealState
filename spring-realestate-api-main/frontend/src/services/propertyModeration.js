import api from './api'

export async function fetchApprovalsByStatus(status) {
  const res = await api.get('/property-moderation/approval', { params: { status } })
  return res.data
}

export async function updatePropertyApproval(propertyId, payload) {
  const res = await api.post(`/property-moderation/${propertyId}/approval`, payload)
  return res.data
}

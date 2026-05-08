import api from './api'

export async function fetchAdminStats() {
  const res = await api.get('/dashboard/admin')
  return res.data
}

export async function fetchOwnerStats() {
  const res = await api.get('/dashboard/owner')
  return res.data
}

export async function fetchCustomerStats() {
  const res = await api.get('/dashboard/customer')
  return res.data
}

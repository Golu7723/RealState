import api from './api'

export async function fetchMyWallet() {
  const res = await api.get('/wallet/me')
  return res.data
}

export async function topUpWallet(amount) {
  const res = await api.post('/wallet/top-up', { amount })
  return res.data
}

export async function transferWallet(payload) {
  const res = await api.post('/wallet/transfer', payload)
  return res.data
}

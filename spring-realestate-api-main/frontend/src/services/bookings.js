import api from './api'

export async function createBooking(payload) {
  const res = await api.post('/bookings', payload)
  return res.data
}

export async function fetchMyBookings() {
  const res = await api.get('/bookings/me')
  return res.data
}

export async function fetchOwnerBookings() {
  const res = await api.get('/bookings/owner')
  return res.data
}

export async function updateBookingStatus(bookingId, status) {
  const res = await api.patch(`/bookings/${bookingId}/status`, { status })
  return res.data
}

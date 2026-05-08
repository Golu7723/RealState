import { useEffect, useState } from 'react'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { createBooking, fetchMyBookings } from '../services/bookings.js'

function BookingPage() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    propertyId: '',
    pgUnitId: '',
    bookingType: 'RENTAL',
    startDate: '',
    endDate: '',
  })

  const load = async () => {
    try {
      setBookings(await fetchMyBookings())
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to load bookings.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await createBooking({
        propertyId: Number(form.propertyId),
        pgUnitId: form.pgUnitId ? Number(form.pgUnitId) : null,
        bookingType: form.bookingType,
        startDate: form.startDate,
        endDate: form.endDate || null,
      })
      setForm({ propertyId: '', pgUnitId: '', bookingType: 'RENTAL', startDate: '', endDate: '' })
      await load()
    } catch (e) {
      setError(e.response?.data?.detail || 'Booking request failed.')
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
      {error ? <Alert type="error">{error}</Alert> : null}
      <form className="section-shell grid gap-3 p-5 md:grid-cols-2" onSubmit={submit}>
        <Input label="Property ID" type="number" value={form.propertyId} onChange={(e) => setForm((s) => ({ ...s, propertyId: e.target.value }))} required />
        <Input label="PG Unit ID (optional)" type="number" value={form.pgUnitId} onChange={(e) => setForm((s) => ({ ...s, pgUnitId: e.target.value }))} />
        <label className="text-sm font-medium text-slate-700">
          Booking Type
          <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" value={form.bookingType} onChange={(e) => setForm((s) => ({ ...s, bookingType: e.target.value }))}>
            <option value="RENTAL">Rental</option>
            <option value="PG_PRIVATE_ROOM">PG Private Room</option>
            <option value="PG_SHARED_BED">PG Shared Bed</option>
          </select>
        </label>
        <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm((s) => ({ ...s, startDate: e.target.value }))} required />
        <Input label="End Date (optional)" type="date" value={form.endDate} onChange={(e) => setForm((s) => ({ ...s, endDate: e.target.value }))} />
        <div className="md:col-span-2">
          <Button type="submit">Create Booking Request</Button>
        </div>
      </form>

      <div className="section-shell overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Monthly Rent</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((b) => (
                <tr key={b.bookingId}>
                  <td className="px-4 py-3">{b.bookingId}</td>
                  <td className="px-4 py-3">{b.propertyId}</td>
                  <td className="px-4 py-3">{b.bookingType}</td>
                  <td className="px-4 py-3">{b.bookingStatus}</td>
                  <td className="px-4 py-3">{b.monthlyRent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default BookingPage

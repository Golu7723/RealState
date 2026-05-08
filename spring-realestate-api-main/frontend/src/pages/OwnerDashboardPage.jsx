import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { fetchOwnerStats } from '../services/dashboard.js'
import { fetchOwnerBookings, updateBookingStatus } from '../services/bookings.js'

function OwnerDashboardPage() {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([fetchOwnerStats(), fetchOwnerBookings()])
      setStats(statsRes)
      setBookings(bookingsRes)
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to load owner dashboard.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onAction = async (bookingId, status) => {
    await updateBookingStatus(bookingId, status)
    await load()
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Owner Dashboard</h1>
        <Link to="/dashboard" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Manage Listings
        </Link>
      </div>
      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="section-shell p-5"><div className="text-xs text-slate-500">Listings</div><div className="mt-2 text-2xl font-bold">{stats?.totalListings ?? '—'}</div></div>
        <div className="section-shell p-5"><div className="text-xs text-slate-500">Total Bookings</div><div className="mt-2 text-2xl font-bold">{stats?.totalBookings ?? '—'}</div></div>
        <div className="section-shell p-5"><div className="text-xs text-slate-500">Pending Requests</div><div className="mt-2 text-2xl font-bold">{stats?.pendingBookings ?? '—'}</div></div>
        <div className="section-shell p-5"><div className="text-xs text-slate-500">Inquiry Count</div><div className="mt-2 text-2xl font-bold">{stats?.totalInquiries ?? '—'}</div></div>
      </div>
      <div className="section-shell overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((b) => (
                <tr key={b.bookingId}>
                  <td className="px-4 py-3">#{b.bookingId}</td>
                  <td className="px-4 py-3">{b.propertyId}</td>
                  <td className="px-4 py-3">{b.bookingType}</td>
                  <td className="px-4 py-3">{b.bookingStatus}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => onAction(b.bookingId, 'OWNER_APPROVED')}>Approve</Button>
                      <Button variant="danger" onClick={() => onAction(b.bookingId, 'OWNER_REJECTED')}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default OwnerDashboardPage

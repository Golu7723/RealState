import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCustomerStats } from '../services/dashboard.js'

function CustomerDashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        setStats(await fetchCustomerStats())
      } catch {
        setStats(null)
      }
    })()
  }, [])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Customer Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="section-shell p-5">
          <div className="text-xs text-slate-500">Total Bookings</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{stats?.totalBookings ?? '—'}</div>
        </div>
        <div className="section-shell p-5">
          <div className="text-xs text-slate-500">Active Bookings</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{stats?.activeBookings ?? '—'}</div>
        </div>
        <div className="section-shell p-5">
          <div className="text-xs text-slate-500">Wallet Balance</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{stats?.walletBalance ?? '—'}</div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/wallet" className="section-shell p-5 hover:border-primary-300">
          <h2 className="font-semibold text-slate-900">Wallet</h2>
          <p className="mt-2 text-sm text-slate-600">Top-up, transfer, and transaction history.</p>
        </Link>
        <Link to="/bookings" className="section-shell p-5 hover:border-primary-300">
          <h2 className="font-semibold text-slate-900">Bookings</h2>
          <p className="mt-2 text-sm text-slate-600">Manage PG and rental booking requests.</p>
        </Link>
        <Link to="/negotiations" className="section-shell p-5 hover:border-primary-300">
          <h2 className="font-semibold text-slate-900">Negotiations</h2>
          <p className="mt-2 text-sm text-slate-600">Track offers and counter-offers.</p>
        </Link>
      </div>
    </section>
  )
}

export default CustomerDashboardPage

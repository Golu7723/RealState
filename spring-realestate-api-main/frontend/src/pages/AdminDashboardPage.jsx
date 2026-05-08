import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchAdminStats } from '../services/dashboard.js'

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        setStats(await fetchAdminStats())
      } catch {
        setStats(null)
      }
    })()
  }, [])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="section-shell p-5">
          <div className="text-sm text-slate-500">Users</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{stats?.totalUsers ?? '—'}</div>
        </div>
        <div className="section-shell p-5">
          <div className="text-sm text-slate-500">Transactions</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{stats?.totalTransactions ?? '—'}</div>
        </div>
        <div className="section-shell p-5">
          <div className="text-sm text-slate-500">Bookings</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{stats?.totalBookings ?? '—'}</div>
        </div>
        <div className="section-shell p-5">
          <div className="text-sm text-slate-500">Approvals</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{stats?.pendingApprovals ?? '—'}</div>
        </div>
      </div>
      <Link to="/admin/approvals" className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
        Go to Property Approvals
      </Link>
    </section>
  )
}

export default AdminDashboardPage

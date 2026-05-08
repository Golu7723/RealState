function DashboardSidebar() {
  return (
    <aside className="section-shell h-fit p-4">
      <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Management
      </div>
      <nav className="space-y-2 text-sm">
        <div className="rounded-xl bg-slate-900 px-3 py-2 font-medium text-white">Listings</div>
        <div className="rounded-xl px-3 py-2 font-medium text-slate-700">Leads</div>
        <div className="rounded-xl px-3 py-2 font-medium text-slate-700">Analytics</div>
      </nav>
    </aside>
  )
}

export default DashboardSidebar

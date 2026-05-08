function DashboardHeader({ onAdd }) {
  return (
    <div className="section-shell flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Agent Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your premium listings and track inventory status.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Add Property
      </button>
    </div>
  )
}

export default DashboardHeader

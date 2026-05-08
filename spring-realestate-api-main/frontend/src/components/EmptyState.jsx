function EmptyState({ title = 'No properties found', message }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current">
          <path d="M4 19h16M5 10l7-6 7 6v9H5z" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">
        {message || 'Try changing filters or search terms to see matching listings.'}
      </p>
    </div>
  )
}

export default EmptyState

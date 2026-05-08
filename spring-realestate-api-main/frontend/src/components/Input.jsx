function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-sm font-medium text-slate-700">{label}</div>
      ) : null}
      <input
        className={[
          'w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
          error ? 'border-rose-300' : 'border-slate-200',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? <div className="mt-1 text-xs text-rose-600">{error}</div> : null}
    </label>
  )
}

export default Input


function Alert({ type = 'info', title, children }) {
  const styles =
    type === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-800'
      : type === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : 'border-slate-200 bg-slate-50 text-slate-800'

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {title ? <div className="mb-1 font-semibold">{title}</div> : null}
      <div>{children}</div>
    </div>
  )
}

export default Alert


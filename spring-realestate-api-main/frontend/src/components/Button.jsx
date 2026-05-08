function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
  ...props
}) {
  const isSubmit = type === 'submit'

  const base =
    'inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const styles =
    variant === 'secondary'
      ? 'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50'
      : variant === 'danger'
        ? 'bg-rose-600 text-white hover:bg-rose-700'
        : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'

  const submitHighlight =
    isSubmit && variant === 'primary'
      ? 'ring-2 ring-primary-300/70 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/35'
      : ''

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${styles} ${submitHighlight} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button


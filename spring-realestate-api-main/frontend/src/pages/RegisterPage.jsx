import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Alert from '../components/Alert.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'

const ROLE_OPTIONS = [
  { value: 'USER', label: 'User' },
  { value: 'AGENT', label: 'Agent' },
  { value: 'ADMIN', label: 'Admin' },
]

function RegisterPage() {
  const { register, loading, error, isAuthenticated, getDashboardPath, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  })
  const [localError, setLocalError] = useState(null)
  const [localSuccess, setLocalSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate(getDashboardPath(user?.role))
  }, [isAuthenticated, navigate, getDashboardPath, user])

  const submit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    setLocalSuccess('')
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      setLocalError('Full name, email, and phone number are required.')
      return
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match.')
      return
    }
    await register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role,
    })
    setLocalSuccess('Account created successfully. Redirecting to your dashboard...')
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl gap-6 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-10 text-white lg:block">
        <div className="absolute -right-20 top-8 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute bottom-4 left-2 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
        <h2 className="relative text-4xl font-bold leading-tight">Create your premium real estate account.</h2>
        <p className="mt-4 text-sm text-slate-200">
          Join as a user, agent, or admin and unlock a personalized workspace with secure role-based access.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(2,6,23,0.08)] sm:p-8">
        <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Register and get redirected to your role dashboard.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {localError ? <Alert type="error">{localError}</Alert> : null}
          {localSuccess ? <Alert type="success">{localSuccess}</Alert> : null}
          {error ? <Alert type="error">{error}</Alert> : null}

          <div>
            <div className="mb-2 text-sm font-medium text-slate-700">Choose role</div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setForm((s) => ({ ...s, role: role.value }))}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    form.role === role.value ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'
                  }`}
                  aria-pressed={form.role === role.value}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Full name"
            value={form.fullName}
            onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            required
          />
          <Input
            label="Phone number"
            type="tel"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            required
          />
          <div>
            <div className="mb-1 text-sm font-medium text-slate-700">Password</div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-20 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm font-medium text-slate-700">Confirm password</div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-20 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-700"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-700">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage


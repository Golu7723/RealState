import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'realestate_token'
const ROLE_KEY = 'realestate_role'

function normalizeRole(role) {
  if (!role) return 'USER'
  if (role === 'CUSTOMER') return 'USER'
  if (role === 'DEALER' || role === 'PROPERTY_OWNER') return 'AGENT'
  return role
}

function getDashboardPath(role) {
  const currentRole = normalizeRole(role)
  if (currentRole === 'ADMIN') return '/dashboard/admin'
  if (currentRole === 'AGENT') return '/dashboard/owner'
  return '/dashboard/customer'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setUser(null)
        return
      }
      try {
        const res = await fetchCurrentUser()
        const payload = res.data || {}
        const role = normalizeRole(payload.role || localStorage.getItem(ROLE_KEY))
        setUser({
          fullName: payload.fullName,
          phone: payload.phone || payload.mobileNumber,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          mobileNumber: payload.mobileNumber || payload.phone,
          role,
        })
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(ROLE_KEY)
        setToken(null)
        setUser(null)
      }
    }
    bootstrap()
  }, [token])

  const navigate = useNavigate()
  const location = useLocation()

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
        role: normalizeRole(credentials.role),
      }
      const res = await api.post('/auth/login', payload)
      const jwt = res.data?.accessToken
      if (jwt) {
        localStorage.setItem(TOKEN_KEY, jwt)
        localStorage.setItem(ROLE_KEY, payload.role)
        setToken(jwt)
        const me = await fetchCurrentUser({
          headers: { Authorization: `Bearer ${jwt}` },
        })
        const mePayload = me.data || {}
        const normalizedRole = normalizeRole(mePayload.role || payload.role)
        setUser({
          fullName: mePayload.fullName,
          phone: mePayload.phone || mePayload.mobileNumber,
          firstName: mePayload.firstName,
          lastName: mePayload.lastName,
          email: mePayload.email,
          mobileNumber: mePayload.mobileNumber || mePayload.phone,
          role: normalizedRole,
        })
        const from = location.state?.from?.pathname
        navigate(from || getDashboardPath(normalizedRole), { replace: true })
      } else {
        throw new Error('Invalid auth response')
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          (err.request ? 'Backend server is not reachable. Start backend on port 8090.' : 'Unable to login. Please try again.'),
      )
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/register', {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        role: normalizeRole(payload.role),
      })
      await login({ email: payload.email, password: payload.password, role: payload.role })
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          (err.request ? 'Backend server is not reachable. Start backend on port 8090.' : 'Unable to register. Please check your details.'),
      )
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    setUser(null)
    setToken(null)
    navigate('/login')
  }

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    getDashboardPath,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

async function fetchCurrentUser(config) {
  try {
    return await api.get('/auth/me', config)
  } catch (error) {
    if (error?.response?.status === 404) {
      return api.get('/auth/user', config)
    }
    throw error
  }
}


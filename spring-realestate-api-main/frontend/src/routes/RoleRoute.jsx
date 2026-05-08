import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function RoleRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading, getDashboardPath } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getDashboardPath(user?.role)} replace />
  }

  return children
}

export default RoleRoute

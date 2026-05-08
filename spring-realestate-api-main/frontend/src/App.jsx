import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import PropertiesPage from './pages/PropertiesPage.jsx'
import PropertyDetailsPage from './pages/PropertyDetailsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import RoleRoute from './routes/RoleRoute.jsx'
import Layout from './components/Layout.jsx'
import CustomerDashboardPage from './pages/CustomerDashboardPage.jsx'
import OwnerDashboardPage from './pages/OwnerDashboardPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import WalletPage from './pages/WalletPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import NegotiationPage from './pages/NegotiationPage.jsx'
import AdminApprovalPage from './pages/AdminApprovalPage.jsx'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/customer" element={<RoleRoute allowedRoles={['USER', 'CUSTOMER']}><CustomerDashboardPage /></RoleRoute>} />
          <Route path="/dashboard/owner" element={<RoleRoute allowedRoles={['AGENT', 'PROPERTY_OWNER', 'DEALER']}><OwnerDashboardPage /></RoleRoute>} />
          <Route path="/dashboard/admin" element={<RoleRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></RoleRoute>} />
          <Route path="/wallet" element={<RoleRoute allowedRoles={['USER', 'AGENT', 'ADMIN', 'CUSTOMER', 'PROPERTY_OWNER', 'DEALER']}><WalletPage /></RoleRoute>} />
          <Route path="/bookings" element={<RoleRoute allowedRoles={['USER', 'AGENT', 'ADMIN', 'CUSTOMER', 'PROPERTY_OWNER', 'DEALER']}><BookingPage /></RoleRoute>} />
          <Route path="/negotiations" element={<RoleRoute allowedRoles={['USER', 'AGENT', 'ADMIN', 'CUSTOMER', 'PROPERTY_OWNER', 'DEALER']}><NegotiationPage /></RoleRoute>} />
          <Route path="/admin/approvals" element={<RoleRoute allowedRoles={['ADMIN']}><AdminApprovalPage /></RoleRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App

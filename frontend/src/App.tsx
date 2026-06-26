import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import ProtectedRoute from './components/ProtectedRoute'

function AdminDashboard() {
  return <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>Admin Dashboard</div>
}
function ReceptionistDashboard() {
  return <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>Receptionist Dashboard</div>
}
function SecurityDashboard() {
  return <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>Security Dashboard</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute requiredRole="Receptionist">
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security"
          element={
            <ProtectedRoute requiredRole="SecurityGuard">
              <SecurityDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

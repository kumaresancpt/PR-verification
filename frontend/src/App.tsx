import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
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

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '999px',
        border: '1.5px solid var(--color-border)',
        backgroundColor: 'var(--color-card-bg)',
        color: 'var(--color-text-dark)',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        fontSize: '13px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'background-color 0.2s, color 0.2s, border-color 0.2s'
      }}
    >
      <span style={{ fontSize: '16px' }}>{isDark ? '☀️' : '🌙'}</span>
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
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
    </ThemeProvider>
  )
}

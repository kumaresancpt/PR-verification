import { ReactNode, useState, useEffect, useRef, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { refresh, logout } from '../services/authService'

const INACTIVITY_WARNING_MS = 25 * 60 * 1000  // 25 minutes
const INACTIVITY_LOGOUT_MS = 30 * 60 * 1000   // 30 minutes
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken')
  const userRole = localStorage.getItem('userRole')
  const navigate = useNavigate()
  const [showWarning, setShowWarning] = useState(false)
  const [extending, setExtending] = useState(false)
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (warningTimer.current) clearTimeout(warningTimer.current)
    if (logoutTimer.current) clearTimeout(logoutTimer.current)
  }, [])

  const startTimers = useCallback(() => {
    clearTimers()
    warningTimer.current = setTimeout(() => setShowWarning(true), INACTIVITY_WARNING_MS)
    logoutTimer.current = setTimeout(async () => {
      await logout()
      navigate('/')
    }, INACTIVITY_LOGOUT_MS)
  }, [clearTimers, navigate])

  const resetActivity = useCallback(() => {
    setShowWarning(false)
    startTimers()
  }, [startTimers])

  useEffect(() => {
    startTimers()
    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, resetActivity, { passive: true }))
    return () => {
      clearTimers()
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, resetActivity))
    }
  }, [startTimers, resetActivity, clearTimers])

  async function handleExtendSession() {
    setExtending(true)
    try {
      const res = await refresh()
      localStorage.setItem('accessToken', res.token)
      resetActivity()
    } catch {
      await logout()
      navigate('/')
    } finally {
      setExtending(false)
    }
  }

  if (!token) return <Navigate to="/" replace />
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" replace />

  return (
    <>
      {children}
      {showWarning && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-warning-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px',
              width: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              textAlign: 'center'
            }}
          >
            <h2
              id="session-warning-title"
              style={{ fontWeight: 600, fontSize: '20px', color: '#292D32' }}
            >
              Session Expiring
            </h2>
            <p style={{ fontSize: '14px', color: '#474A5F' }}>
              Your session will expire in 5 minutes. Click below to extend.
            </p>
            <button
              onClick={handleExtendSession}
              disabled={extending}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#5B21B6',
                borderRadius: '8px',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                color: '#FFFFFF',
                cursor: extending ? 'not-allowed' : 'pointer',
                opacity: extending ? 0.5 : 1
              }}
            >
              {extending ? 'Extending...' : 'Extend Session'}
            </button>
            <button
              onClick={async () => { await logout(); navigate('/') }}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#5B21B6',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Log out now
            </button>
          </div>
        </div>
      )}
    </>
  )
}

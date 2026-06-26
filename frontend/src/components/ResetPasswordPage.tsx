import { useState, CSSProperties } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../services/authService'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNewFocused, setIsNewFocused] = useState(false)
  const [isConfirmFocused, setIsConfirmFocused] = useState(false)

  function validateNewPassword(): boolean {
    if (!newPassword) {
      setNewPasswordError('This field is required.')
      return false
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      setNewPasswordError(
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character.'
      )
      return false
    }
    setNewPasswordError('')
    return true
  }

  function validateConfirmPassword(): boolean {
    if (!confirmPassword) {
      setConfirmPasswordError('This field is required.')
      return false
    }
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match.')
      return false
    }
    setConfirmPasswordError('')
    return true
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    const validNew = validateNewPassword()
    const validConfirm = validateConfirmPassword()
    if (!validNew || !validConfirm) return

    setIsSubmitting(true)
    setApiError('')
    try {
      await resetPassword({ token, newPassword, confirmPassword })
      navigate('/?reset=success')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const pageStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#F3F3F3',
    fontFamily: 'Inter, sans-serif'
  }

  const cardStyle: CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '48px',
    width: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }

  const labelStyle: CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16px',
    color: '#3B3B3B'
  }

  const inputWrapperStyle = (focused: boolean, hasError: boolean): CSSProperties => ({
    border: `1px solid ${hasError ? '#D93025' : focused ? '#5B21B6' : '#B9B9B9'}`,
    borderRadius: '8px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '12px',
    paddingRight: '12px',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    outline: focused ? `2px solid ${hasError ? '#D93025' : '#5B21B6'}` : 'none',
    outlineOffset: '2px'
  })

  const inputStyle: CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#3B3B3B',
    backgroundColor: 'transparent'
  }

  const eyeButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0
  }

  const buttonStyle: CSSProperties = {
    width: '100%',
    height: '48px',
    backgroundColor: '#5B21B6',
    borderRadius: '8px',
    border: 'none',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#FFFFFF',
    cursor: 'pointer'
  }

  const errorStyle: CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    color: '#D93025'
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: '41.6px',
            color: '#5B21B6'
          }}
        >
          Reset Password
        </h1>

        <form
          onSubmit={handleResetPassword}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* New Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="rp-new" style={labelStyle}>
              New Password
            </label>
            <div style={inputWrapperStyle(isNewFocused, !!newPasswordError)}>
              <input
                id="rp-new"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => {
                  setIsNewFocused(false)
                  validateNewPassword()
                }}
                onFocus={() => setIsNewFocused(true)}
                placeholder="Enter new password"
                style={inputStyle}
                aria-describedby={newPasswordError ? 'rp-new-error' : undefined}
                aria-invalid={!!newPasswordError}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                style={eyeButtonStyle}
              >
                <img
                  src="/assets/images/icon-eye.png"
                  alt=""
                  aria-hidden="true"
                  style={{ width: '24px', height: '24px' }}
                />
              </button>
            </div>
            {newPasswordError && (
              <span id="rp-new-error" style={errorStyle} role="alert">
                {newPasswordError}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="rp-confirm" style={labelStyle}>
              Confirm Password
            </label>
            <div style={inputWrapperStyle(isConfirmFocused, !!confirmPasswordError)}>
              <input
                id="rp-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => {
                  setIsConfirmFocused(false)
                  validateConfirmPassword()
                }}
                onFocus={() => setIsConfirmFocused(true)}
                placeholder="Confirm new password"
                style={inputStyle}
                aria-describedby={confirmPasswordError ? 'rp-confirm-error' : undefined}
                aria-invalid={!!confirmPasswordError}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                style={eyeButtonStyle}
              >
                <img
                  src="/assets/images/icon-eye.png"
                  alt=""
                  aria-hidden="true"
                  style={{ width: '24px', height: '24px' }}
                />
              </button>
            </div>
            {confirmPasswordError && (
              <span id="rp-confirm-error" style={errorStyle} role="alert">
                {confirmPasswordError}
              </span>
            )}
          </div>

          {apiError && (
            <div
              style={{
                ...errorStyle,
                fontSize: '14px',
                padding: '8px 12px',
                backgroundColor: '#FEE2E2',
                border: '1px solid #D93025',
                borderRadius: '8px'
              }}
              role="alert"
            >
              {apiError}
            </div>
          )}

          <button type="submit" style={buttonStyle} disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>

          <a
            href="/"
            style={{
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: 'normal',
              color: '#5B21B6',
              textDecoration: 'underline'
            }}
          >
            Back to Login
          </a>
        </form>
      </div>
    </div>
  )
}

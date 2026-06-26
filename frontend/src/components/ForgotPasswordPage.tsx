import { useState, CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgotPassword, verifyOtp } from '../services/authService'

type Step = 'email' | 'otp'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [emailError, setEmailError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isOtpFocused, setIsOtpFocused] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  function validateEmail(): boolean {
    if (!email.trim()) {
      setEmailError('This field is required.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.')
      return false
    }
    setEmailError('')
    return true
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!validateEmail()) return

    setIsSubmitting(true)
    setApiError('')
    try {
      await forgotPassword({ email })
      setSuccessMessage('A 6-digit OTP has been sent to your email.')
      setStep('otp')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!otp.trim()) {
      setOtpError('This field is required.')
      return
    }
    if (!/^\d{6}$/.test(otp)) {
      setOtpError('Please enter a valid 6-digit OTP.')
      return
    }
    setIsSubmitting(true)
    setApiError('')
    try {
      const response = await verifyOtp({ email, otp })
      navigate(`/reset-password?token=${encodeURIComponent(response.token)}`)
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
    backgroundColor: 'var(--color-surface-toggle)',
    fontFamily: 'Inter, sans-serif'
  }

  const cardStyle: CSSProperties = {
    backgroundColor: 'var(--color-card-bg)',
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
    color: 'var(--color-text-dark)'
  }

  const inputWrapperStyle = (focused: boolean, hasError: boolean): CSSProperties => ({
    border: `1px solid ${hasError ? '#D93025' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
    borderRadius: '8px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '12px',
    paddingRight: '12px',
    backgroundColor: 'var(--color-input-bg)',
    outline: focused ? `2px solid ${hasError ? '#D93025' : 'var(--color-primary)'}` : 'none',
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
    color: 'var(--color-text-dark)',
    backgroundColor: 'transparent'
  }

  const buttonStyle: CSSProperties = {
    width: '100%',
    height: '48px',
    backgroundColor: isButtonHovered && !isSubmitting ? 'var(--color-button-hover)' : 'var(--color-primary)',
    borderRadius: '8px',
    border: 'none',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#FFFFFF',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s'
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
            color: 'var(--color-primary)'
          }}
        >
          {step === 'email' ? 'Forgot Password' : 'Enter OTP'}
        </h1>

        {step === 'email' ? (
          <form
            onSubmit={handleForgotPassword}
            noValidate
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="fp-email" style={labelStyle}>
                Email
              </label>
              <div style={inputWrapperStyle(isEmailFocused, !!emailError)}>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => {
                    setIsEmailFocused(false)
                    validateEmail()
                  }}
                  onFocus={() => setIsEmailFocused(true)}
                  placeholder="Enter your email address"
                  style={inputStyle}
                  aria-describedby={emailError ? 'fp-email-error' : undefined}
                  aria-invalid={!!emailError}
                  autoComplete="email"
                />
              </div>
              {emailError && (
                <span id="fp-email-error" style={errorStyle} role="alert">
                  {emailError}
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
            <button
              type="submit"
              style={buttonStyle}
              disabled={isSubmitting}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              {isSubmitting ? 'Sending...' : 'Send OTP'}
            </button>
            <a
              href="/"
              style={{
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: 'normal',
                color: 'var(--color-primary)',
                textDecoration: 'underline'
              }}
            >
              Back to Login
            </a>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            noValidate
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {successMessage && (
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#16A34A',
                  padding: '8px 12px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: '8px'
                }}
                role="status"
              >
                {successMessage}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="fp-otp" style={labelStyle}>
                Enter OTP
              </label>
              <div style={inputWrapperStyle(isOtpFocused, !!otpError)}>
                <input
                  id="fp-otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onBlur={() => setIsOtpFocused(false)}
                  onFocus={() => setIsOtpFocused(true)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  style={inputStyle}
                  aria-describedby={otpError ? 'fp-otp-error' : undefined}
                  aria-invalid={!!otpError}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />
              </div>
              {otpError && (
                <span id="fp-otp-error" style={errorStyle} role="alert">
                  {otpError}
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
            <button
              type="submit"
              style={buttonStyle}
              disabled={isSubmitting}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

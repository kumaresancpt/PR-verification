import { useState, CSSProperties } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import RoleSelector, { Role } from './RoleSelector'
import { login } from '../services/authService'

const roleRedirectMap: Record<Role, string> = {
  Admin: '/admin',
  Receptionist: '/receptionist',
  SecurityGuard: '/security'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<Role>('Admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [isUsernameFocused, setIsUsernameFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const isFormValid = username.trim().length > 0 && password.length > 0

  function validateUsername() {
    if (!username.trim()) {
      setUsernameError('This field is required.')
    } else {
      setUsernameError('')
    }
  }

  function validatePassword() {
    if (!password) {
      setPasswordError('This field is required.')
    } else {
      setPasswordError('')
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    validateUsername()
    validatePassword()
    if (!isFormValid) return

    setIsSubmitting(true)
    setApiError('')
    try {
      const response = await login({ username, password, role: selectedRole, keepLoggedIn })
      localStorage.setItem('accessToken', response.token)
      localStorage.setItem('userRole', response.role)
      navigate(roleRedirectMap[selectedRole])
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Layout ──────────────────────────────────────────────────────────────────

  // Outer: full-viewport flex row (hero left, panel right)
  const pageStyle: CSSProperties = {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: 'var(--color-background)'
  }

  // Left: hero image fills remaining space
  const heroStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    backgroundImage: 'url(/assets/images/hero-background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }

  // Right: white panel, fixed width, flex column
  const rightPanelStyle: CSSProperties = {
    width: '596px',
    flexShrink: 0,
    height: '100vh',
    backgroundColor: 'var(--color-panel-bg)',
    borderRadius: '56px 0 0 56px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  }

  // Logo — sits at top of panel
  const logoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '40px 40px 0 48px',
    flexShrink: 0
  }

  // Form wrapper — takes remaining height, centres the form
  const formWrapperStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px'
  }

  // Form container — inner card
  const formContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'center',
    width: '100%',
    maxWidth: '480px'
  }

  // Copyright — bottom of panel
  const copyrightStyle: CSSProperties = {
    flexShrink: 0,
    textAlign: 'center',
    padding: '0 16px 24px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 'normal',
    color: 'var(--color-text-primary)',
    whiteSpace: 'nowrap'
  }

  // ── Form element styles ──────────────────────────────────────────────────────

  const headingGroupStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    alignItems: 'center',
    letterSpacing: '0.208px',
    whiteSpace: 'nowrap'
  }

  const formFieldsGroupStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    alignItems: 'flex-start',
    width: '400px'
  }

  const fieldContainerStyle: CSSProperties = {
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  }

  const labelStyle: CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16px',
    color: 'var(--color-text-dark)'
  }

  const inputWrapperStyle = (focused: boolean, hasError: boolean): CSSProperties => ({
    position: 'relative',
    backgroundColor: 'var(--color-input-bg)',
    border: `1px solid ${hasError ? '#D93025' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
    borderRadius: '8px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '12px',
    paddingRight: '12px',
    gap: '8px',
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
    backgroundColor: 'transparent',
    letterSpacing: '0.5px'
  }

  const errorTextStyle: CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    color: '#D93025'
  }

  const loginButtonStyle: CSSProperties = {
    width: '400px',
    height: '48px',
    backgroundColor: isButtonHovered && !isSubmitting
      ? 'var(--color-button-hover)'
      : 'var(--color-primary)',
    borderRadius: '8px',
    border: 'none',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#FFFFFF',
    cursor: isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
    opacity: !isFormValid || isSubmitting ? 0.5 : 1,
    transition: 'background-color 0.2s'
  }

  return (
    <div style={pageStyle}>
      {/* Left: hero background */}
      <div style={heroStyle} aria-hidden="true" />

      {/* Right: white panel */}
      <div style={rightPanelStyle}>

        {/* Logo */}
        <div style={logoStyle}>
          <img
            src="/assets/images/visitor-logo-icon.png"
            alt="VISITOR logo icon"
            style={{ width: '56px', height: '67px', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 900,
                fontSize: '31.127px',
                lineHeight: 'normal',
                color: 'var(--color-primary)',
                textTransform: 'uppercase'
              }}
            >
              VISITOR
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 500,
                  fontSize: '12.105px',
                  lineHeight: 'normal',
                  color: 'var(--color-text-primary)'
                }}
              >
                Powered by
              </span>
              <img
                src="/assets/images/cpt-logo.png"
                alt="Changepond"
                style={{ width: '175px', height: '18px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Form wrapper — vertically centres the form */}
        <div style={formWrapperStyle}>
          <form style={formContainerStyle} onSubmit={handleLogin} noValidate>

            {/* Heading */}
            <div style={headingGroupStyle}>
              <h1
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '33px',
                  lineHeight: '41.6px',
                  color: 'var(--color-primary)',
                  letterSpacing: '0.208px'
                }}
              >
                Login
              </h1>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: 'normal',
                  color: 'var(--color-text-muted)'
                }}
              >
                Welcome to Visitor
              </p>
            </div>

            {/* Role Selector */}
            <RoleSelector value={selectedRole} onChange={setSelectedRole} />

            {/* Form Fields */}
            <div style={formFieldsGroupStyle}>
              {/* Username */}
              <div style={fieldContainerStyle}>
                <label htmlFor="username" style={labelStyle}>
                  Username
                </label>
                <div style={inputWrapperStyle(isUsernameFocused, !!usernameError)}>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => { setIsUsernameFocused(false); validateUsername() }}
                    onFocus={() => setIsUsernameFocused(true)}
                    placeholder="ex., john@123"
                    style={inputStyle}
                    aria-describedby={usernameError ? 'username-error' : undefined}
                    aria-invalid={!!usernameError}
                    autoComplete="username"
                  />
                  <img
                    src="/assets/images/icon-user.png"
                    alt=""
                    aria-hidden="true"
                    style={{ width: '24px', height: '24px', flexShrink: 0 }}
                  />
                </div>
                {usernameError && (
                  <span id="username-error" style={errorTextStyle} role="alert">
                    {usernameError}
                  </span>
                )}
              </div>

              {/* Password */}
              <div style={{ width: '400px' }}>
                <div style={fieldContainerStyle}>
                  <label htmlFor="password" style={labelStyle}>
                    Password
                  </label>
                  <div style={inputWrapperStyle(isPasswordFocused, !!passwordError)}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => { setIsPasswordFocused(false); validatePassword() }}
                      onFocus={() => setIsPasswordFocused(true)}
                      placeholder="Please Enter"
                      style={inputStyle}
                      aria-describedby={passwordError ? 'password-error' : undefined}
                      aria-invalid={!!passwordError}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0
                      }}
                    >
                      <img
                        src="/assets/images/icon-eye.png"
                        alt=""
                        aria-hidden="true"
                        style={{ width: '24px', height: '24px' }}
                      />
                    </button>
                  </div>
                  {passwordError && (
                    <span id="password-error" style={errorTextStyle} role="alert">
                      {passwordError}
                    </span>
                  )}
                </div>

                {/* Keep logged in + Forgot Password row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '400px',
                    marginTop: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      id="keepLoggedIn"
                      type="checkbox"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      style={{
                        width: '16px', height: '16px',
                        border: '1.5px solid var(--color-border-checkbox)',
                        borderRadius: '2px', cursor: 'pointer',
                        accentColor: 'var(--color-primary)', flexShrink: 0
                      }}
                    />
                    <label
                      htmlFor="keepLoggedIn"
                      style={{
                        fontFamily: 'Inter, sans-serif', fontWeight: 400,
                        fontSize: '14px', lineHeight: 'normal',
                        color: 'var(--color-text-dark)', letterSpacing: '0.2px',
                        marginLeft: '8px', cursor: 'pointer'
                      }}
                    >
                      Keep me logged In
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    style={{
                      fontFamily: 'Inter, sans-serif', fontWeight: 400,
                      fontSize: '14px', lineHeight: 'normal',
                      color: 'var(--color-primary)', textDecoration: 'underline',
                      letterSpacing: '0.2px', whiteSpace: 'nowrap'
                    }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </div>

            {/* API Error */}
            {apiError && (
              <div
                style={{
                  width: '400px', padding: '8px 12px',
                  backgroundColor: '#FEE2E2', border: '1px solid #D93025',
                  borderRadius: '8px', fontFamily: 'Inter, sans-serif',
                  fontWeight: 400, fontSize: '14px', color: '#D93025'
                }}
                role="alert"
              >
                {apiError}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              style={loginButtonStyle}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            {/* Sign Up */}
            <div
              style={{
                width: '400px', textAlign: 'center',
                fontFamily: 'Inter, sans-serif', fontWeight: 400,
                fontSize: '16px', lineHeight: 'normal',
                color: 'var(--color-secondary)'
              }}
            >
              Don&apos;t have an account?{' '}
              <a
                href="#signup"
                style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  fontSize: '16px', color: 'var(--color-primary)',
                  textDecoration: 'underline'
                }}
              >
                Sign up
              </a>
            </div>

          </form>
        </div>

        {/* Copyright */}
        <p style={copyrightStyle}>Copyright 2026 Changepond. All Rights Reserved.</p>

      </div>
    </div>
  )
}

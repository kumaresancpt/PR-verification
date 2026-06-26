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

  // ── Styles — every value from figma.md Visual Spec ──────────────────────────

  const pageStyle: CSSProperties = {
    position: 'relative',
    width: '1440px',
    height: '885px',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    fontFamily: 'Inter, sans-serif'
  }

  // node 40:5198 — container image intent
  const bgPhotoStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '1440px',
    height: '885px',
    backgroundImage: 'url(/assets/images/hero-background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }

  // node 40:5199 — White Panel
  const whitePanelStyle: CSSProperties = {
    position: 'absolute',
    left: '844px',
    top: 0,
    width: '596px',
    height: '885px',
    backgroundColor: '#FFFFFF',
    borderRadius: '56px 0 0 56px'
  }

  // node 40:5200 — Logo
  const logoStyle: CSSProperties = {
    position: 'absolute',
    left: '986px',
    top: '103px',
    width: '313px',
    height: '73.494px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }

  // node 40:5206 — Copyright
  const copyrightStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '844px',
    transform: 'translateX(-50%)',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 'normal',
    color: '#292D32',
    whiteSpace: 'nowrap'
  }

  // node 40:5207 — Form Container
  const formContainerStyle: CSSProperties = {
    position: 'absolute',
    left: '902px',
    top: '50%',
    transform: 'translateY(calc(-50% + 39.5px))',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'center',
    padding: '80px 40px',
    borderRadius: '20px',
    width: '480px'
  }

  // node 40:5208 — Heading Group
  const headingGroupStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    alignItems: 'center',
    letterSpacing: '0.208px',
    whiteSpace: 'nowrap'
  }

  // node 40:5212 — Form Fields Group
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
    color: '#3B3B3B'
  }

  const inputWrapperStyle = (focused: boolean, hasError: boolean): CSSProperties => ({
    position: 'relative',
    backgroundColor: '#FFFFFF',
    border: `1px solid ${hasError ? '#D93025' : focused ? '#5B21B6' : '#B9B9B9'}`,
    borderRadius: '8px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '12px',
    paddingRight: '12px',
    gap: '8px',
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
    backgroundColor: 'transparent',
    letterSpacing: '0.5px'
  }

  const errorTextStyle: CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    color: '#D93025'
  }

  // node 40:5234 — Login Button (with hover + disabled variant states)
  const loginButtonStyle: CSSProperties = {
    width: '400px',
    height: '48px',
    backgroundColor: isButtonHovered && isFormValid && !isSubmitting ? '#4A1A9E' : '#5B21B6',
    borderRadius: '8px',
    border: 'none',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#FFFFFF',
    cursor: isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
    opacity: !isFormValid || isSubmitting ? 0.5 : 1
  }

  return (
    <div style={pageStyle}>
      {/* Background Photo — node 40:5198, container intent */}
      <div style={bgPhotoStyle} aria-hidden="true" />

      {/* White Panel — node 40:5199 */}
      <div style={whitePanelStyle} />

      {/* Logo — node 40:5200 */}
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
              color: '#5B21B6',
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
                color: '#000000'
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

      {/* Copyright — node 40:5206 */}
      <p style={copyrightStyle}>Copyright 2026 Changepond. All Rights Reserved.</p>

      {/* Form Container — node 40:5207 */}
      <form style={formContainerStyle} onSubmit={handleLogin} noValidate>
        {/* Heading Group — node 40:5208 */}
        <div style={headingGroupStyle}>
          <h1
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '33px',
              lineHeight: '41.6px',
              color: '#5B21B6',
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
              color: '#474A5F'
            }}
          >
            Welcome to Visitor
          </p>
        </div>

        {/* Role Selector — node 40:5301 */}
        <RoleSelector value={selectedRole} onChange={setSelectedRole} />

        {/* Form Fields Group — node 40:5212 */}
        <div style={formFieldsGroupStyle}>
          {/* Username Field — node 40:5213 */}
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
                onBlur={() => {
                  setIsUsernameFocused(false)
                  validateUsername()
                }}
                onFocus={() => setIsUsernameFocused(true)}
                placeholder="ex., john@123"
                style={inputStyle}
                aria-describedby={usernameError ? 'username-error' : undefined}
                aria-invalid={!!usernameError}
                autoComplete="username"
              />
              {/* user-03 icon — node 40:5219 */}
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

          {/* Password Section — node 40:5220 (overlapping grid layout) */}
          <div style={{ width: '400px' }}>
            {/* Password Field — node 40:5225 */}
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
                  onBlur={() => {
                    setIsPasswordFocused(false)
                    validatePassword()
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  placeholder="Please Enter"
                  style={inputStyle}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  aria-invalid={!!passwordError}
                  autoComplete="current-password"
                />
                {/* Eye icon toggle — node 40:5231 */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0
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

            {/* Keep me logged in + Forgot Password — nodes 40:5222, 40:5221 */}
            {/* inline-grid row-1/col-1 layout per Figma constraint */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '400px',
                width: '400px',
                marginTop: '12px'
              }}
            >
              {/* Keep me logged In row — node 40:5222 */}
              <div
                style={{
                  gridColumn: 1,
                  gridRow: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <input
                  id="keepLoggedIn"
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '1.5px solid #252525',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    accentColor: '#5B21B6',
                    flexShrink: 0
                  }}
                />
                <label
                  htmlFor="keepLoggedIn"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: 'normal',
                    color: '#3B3B3B',
                    letterSpacing: '0.2px',
                    marginLeft: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Keep me logged In
                </label>
              </div>

              {/* Forgot Password — node 40:5221, ml 273px per Figma constraint */}
              <Link
                to="/forgot-password"
                style={{
                  gridColumn: 1,
                  gridRow: 1,
                  marginLeft: '273px',
                  alignSelf: 'center',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: 'normal',
                  color: '#5B21B6',
                  textDecoration: 'underline',
                  letterSpacing: '0.2px',
                  whiteSpace: 'nowrap'
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div
            style={{
              width: '400px',
              padding: '8px 12px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #D93025',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              color: '#D93025'
            }}
            role="alert"
          >
            {apiError}
          </div>
        )}

        {/* Login Button — node 40:5234 */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          style={loginButtonStyle}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        {/* Sign Up Link — node 40:5236 */}
        <div
          style={{
            width: '400px',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: 'normal',
            color: '#353638'
          }}
        >
          Don&apos;t have an account?{' '}
          <a
            href="#signup"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: '#5B21B6',
              textDecoration: 'underline'
            }}
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  )
}

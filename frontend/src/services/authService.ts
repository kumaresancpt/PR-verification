export interface LoginRequest {
  username: string
  password: string
  role: string
  keepLoggedIn: boolean
}

export interface LoginResponse {
  token: string
  role: string
  expiresAt: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

const BASE_URL = '/api/auth'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'An unexpected error occurred.' }))
    throw new Error(error.detail || 'An unexpected error occurred.')
  }
  return res.json()
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return handleResponse<LoginResponse>(res)
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return handleResponse<{ message: string }>(res)
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<{ token: string }> {
  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return handleResponse<{ token: string }>(res)
}

export async function resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return handleResponse<{ message: string }>(res)
}

export async function refresh(): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  return handleResponse<LoginResponse>(res)
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem('accessToken')
  await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userRole')
}

import axios from 'axios'
import Cookies from 'js-cookie'

// Usa URL relativa — o browser chama /api/* e o Next.js proxy encaminha para o backend
const API_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = Cookies.get('refresh_token')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken })
          const { accessToken, refreshToken: newRefreshToken } = response.data.data

          Cookies.set('access_token', accessToken, { expires: 1/96 }) // 15 min
          Cookies.set('refresh_token', newRefreshToken, { expires: 7 })

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch {
          // Refresh failed - clear tokens and redirect to login
          Cookies.remove('access_token')
          Cookies.remove('refresh_token')
          Cookies.remove('user')
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      } else {
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  Cookies.set('access_token', accessToken, { expires: 1/96, secure: isSecure, sameSite: 'strict' })
  Cookies.set('refresh_token', refreshToken, { expires: 7, secure: isSecure, sameSite: 'strict' })
}

export const clearAuthTokens = () => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  Cookies.remove('user')
}

export const getUser = () => {
  try {
    const user = Cookies.get('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export const setUser = (user: any) => {
  Cookies.set('user', JSON.stringify(user), { expires: 7 })
}

export default api

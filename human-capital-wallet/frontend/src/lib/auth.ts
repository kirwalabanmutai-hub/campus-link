import Cookies from 'js-cookie'
import type { User } from '@/types'

const TOKEN_KEY = 'hcw_token'
const USER_KEY  = 'hcw_user'

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' })
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY)
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY)
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY)
  }
}

export function setUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as User } catch { return null }
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function logout() {
  removeToken()
  if (typeof window !== 'undefined') {
    window.location.assign(new URL('/login', window.location.origin).toString())
  }
}

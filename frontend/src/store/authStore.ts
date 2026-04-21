import { create } from 'zustand'
import { getMe, login as apiLogin } from '../api/auth'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loadMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { access_token } = await apiLogin({ email, password })
      localStorage.setItem('token', access_token)
      const user = await getMe()
      set({ token: access_token, user, loading: false })
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  loadMe: async () => {
    const token = get().token
    if (!token) return
    try {
      const user = await getMe()
      set({ user, token })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, token: null })
    }
  },
}))

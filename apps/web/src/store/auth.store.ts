import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@jibscan/types'

interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          // 미들웨어(서버)에서 읽을 수 있도록 쿠키에도 플래그 설정 (httpOnly 아님 — 토큰 값 저장 금지)
          document.cookie = 'jibscan-auth-token=1; path=/; SameSite=Lax; max-age=900'
        }
        set({ accessToken, isAuthenticated: true })
      },

      setUser: (user) => set({ user }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          document.cookie = 'jibscan-auth-token=; path=/; max-age=0'
        }
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'jibscan-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

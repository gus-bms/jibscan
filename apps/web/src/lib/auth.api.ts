import type { AuthTokens, User } from '@jibscan/types'
import { api } from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name?: string
}

export const authApi = {
  login: (body: LoginRequest) => api.post<AuthTokens>('/auth/login', body),
  signup: (body: SignupRequest) => api.post<AuthTokens>('/auth/signup', body),
  me: () => api.get<User>('/auth/me'),
}

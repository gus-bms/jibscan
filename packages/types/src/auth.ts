export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name?: string
}

export interface JwtPayload {
  sub: string   // user id
  email: string
  iat?: number
  exp?: number
}

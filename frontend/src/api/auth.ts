import type { User } from '../types'
import client from './client'

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { email: string; username: string; password: string }
export interface TokenResponse { access_token: string; token_type: string }

export const login = (data: LoginPayload): Promise<TokenResponse> =>
  client.post<TokenResponse>('/auth/login', data).then((r) => r.data)

export const register = (data: RegisterPayload): Promise<{ message: string }> =>
  client.post<{ message: string }>('/auth/register', data).then((r) => r.data)

export const getMe = (): Promise<User> =>
  client.get<User>('/auth/me').then((r) => r.data)

export const verifyEmail = (token: string): Promise<{ message: string }> =>
  client.get<{ message: string }>(`/auth/verify-email?token=${token}`).then((r) => r.data)

export const forgotPassword = (email: string): Promise<{ message: string }> =>
  client.post<{ message: string }>('/auth/forgot-password', { email }).then((r) => r.data)

export const resetPassword = (token: string, new_password: string): Promise<{ message: string }> =>
  client.post<{ message: string }>('/auth/reset-password', { token, new_password }).then((r) => r.data)

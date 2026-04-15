import type { User } from '../types'
import client from './client'

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { email: string; username: string; password: string }
export interface TokenResponse { access_token: string; token_type: string }

export const login = (data: LoginPayload): Promise<TokenResponse> =>
  client.post<TokenResponse>('/auth/login', data).then((r) => r.data)

export const register = (data: RegisterPayload): Promise<User> =>
  client.post<User>('/auth/register', data).then((r) => r.data)

export const getMe = (): Promise<User> =>
  client.get<User>('/auth/me').then((r) => r.data)

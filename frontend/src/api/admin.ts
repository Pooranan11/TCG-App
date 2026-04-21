import type { UserRole } from '../types'
import client from './client'

export interface AdminUser {
  id: number
  email: string
  username: string
  role: UserRole
  is_verified: boolean
  is_active: boolean
  created_at: string
}

export const fetchAdminUsers = (): Promise<AdminUser[]> =>
  client.get<AdminUser[]>('/admin/users').then((r) => r.data)

export const patchAdminUser = (
  id: number,
  data: Partial<{ role: string; is_active: boolean }>,
): Promise<AdminUser> =>
  client.patch<AdminUser>(`/admin/users/${id}`, data).then((r) => r.data)

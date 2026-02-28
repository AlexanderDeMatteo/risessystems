/**
 * Types for users and sessions. Aligned with tables users, sessions.
 */

export type UserRole = 'owner' | 'admin'

export interface User {
  id: number
  email: string
  password_hash: string
  name: string
  gym_name: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Session {
  id: number
  user_id: number
  token: string
  expires_at: string
  created_at: string
}

export type UserRole = 'owner' | 'admin'

export interface User {
  id: number
  email: string
  name: string
  gym_name: string | null
  role: UserRole
  is_active: boolean
  auth_user_id?: string | null
  created_at?: string
  updated_at?: string
}

export type TrainerStatus = 'active' | 'inactive'

export interface Trainer {
  id: number
  user_id: number
  name: string
  email: string
  phone: string | null
  specialties: string | null
  branch_id: number | null
  status: TrainerStatus
  is_primary: boolean
  hire_date: string | null
  avatar_url: string | null
  auth_user_id?: string | null
  created_at: string
  updated_at: string
}

export interface TrainerMember {
  id: number
  trainer_id: number
  member_id: number
  status: string
  assigned_at: string
  ended_at: string | null
}

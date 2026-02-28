/**
 * Types for trainers and trainer-member assignment. Aligned with tables trainers, trainer_members.
 */

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
  notes: string | null
  created_at: string
  updated_at: string
  /** Future: link to Supabase Auth (app mobile) */
  auth_user_id?: string | null
  /** Display: branch name when joined from UI */
  branch?: string
}

export type TrainerMemberStatus = 'active' | 'ended'

export interface TrainerMember {
  id: number
  trainer_id: number
  member_id: number
  status: TrainerMemberStatus
  assigned_at: string
  ended_at: string | null
}

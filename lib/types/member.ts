/**
 * Types for members and check-ins. Aligned with tables members, check_ins.
 * Extended with optional gamification/auth fields for future backend.
 */

export type MemberStatus = 'active' | 'suspended' | 'inactive'
export type MembershipType = 'premium' | 'standard' | 'basic'

export interface Member {
  id: number
  user_id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  membership_type: MembershipType
  status: MemberStatus
  join_date: string
  expiry_date: string | null
  qr_code: string | null
  notes: string | null
  created_at: string
  updated_at: string
  /** Future: link to Supabase Auth (app mobile) */
  auth_user_id?: string | null
  /** Future: cached total XP */
  xp_total?: number
  /** Future: current level id */
  current_level_id?: number | null
  /** Future: current check-in streak days */
  current_streak_days?: number
}

export interface CheckIn {
  id: number
  member_id: number
  check_in_time: string
  check_out_time: string | null
  duration_minutes: number | null
  notes: string | null
}

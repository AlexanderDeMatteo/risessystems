/**
 * Types for gym membership plans. Aligned with table membership_plans.
 */

export interface MembershipPlan {
  id: number
  user_id: number
  name: string
  description: string | null
  price: number
  duration_days: number
  is_active: boolean
  created_at: string
  updated_at: string
}

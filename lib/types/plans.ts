/**
 * Gym membership plan shape used in dashboard plans UI (subset of membership_plans row).
 */

export interface MembershipPlan {
  id: number
  name: string
  description: string | null
  price: number
  duration_days: number
  is_active: boolean
}

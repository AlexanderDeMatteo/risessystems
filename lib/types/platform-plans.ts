/**
 * Types for platform plans (tiers) and subscription.
 * Aligned with future API / platform_plans table.
 */

export interface PlatformPlan {
  id: number
  name: string
  min_active_users: number
  max_active_users: number | null
  price_monthly: number
  is_active: boolean
  sort_order: number
  /** Above this many active users, charge overage_price_per_user per extra user. null = no overage. */
  overage_threshold?: number | null
  /** Price per user when active count exceeds overage_threshold. */
  overage_price_per_user?: number
}

export interface SubscriptionInfo {
  planName: string
  priceMonthly: number
  nextBillingDate: string
  activeMembersCount: number
  /** When price includes overage (active users > threshold). */
  priceBreakdown?: { base: number; overage: number }
}

/** Client (gym) with assigned plan computed from active user count */
export interface ClientWithPlan {
  id: number
  name: string
  activeUsers: number
  assignedPlan: PlatformPlan | null
}

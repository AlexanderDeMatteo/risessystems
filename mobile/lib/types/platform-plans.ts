export interface PlatformPlan {
  id: number
  name: string
  min_active_users: number
  max_active_users: number | null
  price_monthly: number
  is_active: boolean
  sort_order: number
  overage_threshold?: number | null
  overage_price_per_user?: number
}

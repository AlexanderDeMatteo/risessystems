/**
 * Mock membership plans for dashboard Plans tab and accounting.
 */

export interface MembershipPlan {
  id: number
  name: string
  description: string | null
  price: number
  duration_days: number
  is_active: boolean
}

export const MOCK_PLANS: MembershipPlan[] = [
  { id: 1, name: 'Monthly', description: 'Full gym access, 1 month', price: 49.99, duration_days: 30, is_active: true },
  { id: 2, name: 'Quarterly', description: 'Full gym access, 3 months', price: 129.99, duration_days: 90, is_active: true },
  { id: 3, name: 'Annual Premium', description: 'Full access + personal trainer sessions', price: 399.99, duration_days: 365, is_active: true },
  { id: 4, name: 'Basic', description: 'Gym floor only', price: 29.99, duration_days: 30, is_active: true },
]

/**
 * Types for payments and revenue summary. Aligned with tables payments, revenue_summary.
 */

export type PaymentType = 'membership' | 'personal_training' | 'other'
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: number
  user_id: number
  member_id: number | null
  amount: number
  payment_type: PaymentType
  description: string
  payment_method: PaymentMethod
  status: PaymentStatus
  paid_at: string
  created_at: string
  updated_at: string
}

export interface RevenueSummary {
  id: number
  user_id: number
  summary_date: string
  daily_revenue: number
  membership_fees: number
  personal_training: number
  other_revenue: number
  total_transactions: number
  created_at: string
}

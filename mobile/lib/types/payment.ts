export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: number
  user_id: number
  member_id: number | null
  amount: number
  payment_type: string
  description: string
  payment_method: string
  status: PaymentStatus
  paid_at: string
  created_at: string
  updated_at: string
}

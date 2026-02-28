/**
 * Mock payments for dashboard accounting and admin accounting.
 */

export interface DashboardPayment {
  id: number
  name: string
  amount: number
  payment_method: 'card' | 'cash' | 'bank_transfer'
  status: string
  payment_date: string
}

export const MOCK_DASHBOARD_PAYMENTS: DashboardPayment[] = [
  { id: 1, name: 'John Smith', amount: 150, payment_method: 'card', status: 'completed', payment_date: new Date().toISOString() },
  { id: 2, name: 'Sarah Johnson', amount: 500, payment_method: 'cash', status: 'completed', payment_date: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, name: 'Mike Davis', amount: 75, payment_method: 'bank_transfer', status: 'pending', payment_date: new Date(Date.now() - 172800000).toISOString() },
  { id: 4, name: 'Emma Wilson', amount: 300, payment_method: 'card', status: 'completed', payment_date: new Date(Date.now() - 259200000).toISOString() },
  { id: 5, name: 'David Brown', amount: 200, payment_method: 'card', status: 'completed', payment_date: new Date(Date.now() - 345600000).toISOString() },
]

export interface AdminPayment {
  id: number
  clientName: string
  amount: number
  paymentMethod: string
  status: string
  paymentDate: string
}

export const MOCK_ADMIN_PAYMENTS: AdminPayment[] = [
  { id: 1, clientName: 'FitZone Gym', amount: 2500, paymentMethod: 'Card', status: 'completed', paymentDate: new Date().toISOString() },
  { id: 2, clientName: "Gold's Fitness", amount: 5000, paymentMethod: 'Bank Transfer', status: 'completed', paymentDate: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, clientName: 'BodyPower Gym', amount: 1500, paymentMethod: 'Card', status: 'pending', paymentDate: new Date(Date.now() - 172800000).toISOString() },
  { id: 4, clientName: 'Elite Sports Club', amount: 3200, paymentMethod: 'Bank Transfer', status: 'completed', paymentDate: new Date(Date.now() - 259200000).toISOString() },
  { id: 5, clientName: 'CrossFit HQ', amount: 800, paymentMethod: 'Card', status: 'completed', paymentDate: new Date(Date.now() - 345600000).toISOString() },
]

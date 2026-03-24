export type NotificationType =
  | 'new_member'
  | 'payment'
  | 'expiring'
  | 'checkin'
  | 'payment_pending'
  | 'expired'
  | 'new_gym'
  | 'platform_payment'
  | 'platform_payment_pending'
  | 'subscription_expiring'
  | 'competition_assigned'
  | 'competition_finished'
  | 'competition_ending_soon'
  | 'competitions_active_summary'

export type NotificationItem = {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  href: string
}

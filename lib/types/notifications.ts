export type NotificationType =
  | 'new_member'
  | 'payment'
  | 'expiring'
  | 'checkin'
  | 'payment_pending'
  | 'expired'

export type NotificationItem = {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  href: string
}

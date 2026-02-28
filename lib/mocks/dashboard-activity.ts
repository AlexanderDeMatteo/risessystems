/**
 * Mock recent activity for dashboard. Component maps activityType to icon.
 */
export type ActivityType = 'member_added' | 'checkin' | 'payment' | 'alert'

export interface RecentActivityItem {
  id: string
  type: ActivityType
  description: string
  member: string
  time: string
  color: string
}

export const MOCK_RECENT_ACTIVITIES: RecentActivityItem[] = [
  { id: '1', type: 'member_added', description: 'New member registered', member: 'John Doe', time: '2 hours ago', color: 'bg-emerald-500/10 text-emerald-400' },
  { id: '2', type: 'checkin', description: 'Member check-in', member: 'Sarah Smith', time: '45 minutes ago', color: 'bg-blue-500/10 text-blue-400' },
  { id: '3', type: 'payment', description: 'Payment received', member: 'Mike Johnson', time: '1 hour ago', color: 'bg-purple-500/10 text-purple-400' },
  { id: '4', type: 'alert', description: 'Membership expiring soon', member: 'Emma Wilson', time: '3 hours ago', color: 'bg-amber-500/10 text-amber-400' },
  { id: '5', type: 'checkin', description: 'Member check-in', member: 'David Lee', time: '5 hours ago', color: 'bg-blue-500/10 text-blue-400' },
]

/**
 * Types for dashboard overview and charts. Used by app/actions/dashboard and dashboard components.
 */

export interface DashboardCounts {
  memberCount: number
  trainerCount: number
  branchCount: number
  checkInsToday: number
  revenueThisMonth: number
  revenueLastMonth: number
  membersThisMonth: number
}

export interface SalesChartPoint {
  date: string
  sales: number
  members: number
  checkins: number
}

export interface MembershipPieSegment {
  name: string
  value: number
  color: string
}

export interface RevenueChartPoint {
  name: string
  memberships: number
  training: number
  other: number
}

export type ActivityType = 'member_added' | 'checkin' | 'payment' | 'alert'

export interface RecentActivityItem {
  id: string
  type: ActivityType
  description: string
  member: string
  time: string
  color: string
}

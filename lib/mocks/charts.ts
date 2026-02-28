/**
 * Mock chart data for dashboard and accounting.
 */

export interface SalesChartPoint {
  date: string
  sales: number
  members: number
  checkins: number
}

export const MOCK_SALES_CHART_DATA: SalesChartPoint[] = [
  { date: 'Jan 1', sales: 2400, members: 1200, checkins: 950 },
  { date: 'Jan 8', sales: 3210, members: 1380, checkins: 1100 },
  { date: 'Jan 15', sales: 2900, members: 1500, checkins: 1200 },
  { date: 'Jan 22', sales: 3800, members: 1700, checkins: 1450 },
  { date: 'Jan 29', sales: 4200, members: 1890, checkins: 1680 },
  { date: 'Feb 5', sales: 4900, members: 2100, checkins: 1950 },
  { date: 'Feb 12', sales: 5200, members: 2300, checkins: 2100 },
]

export interface MembershipPieSegment {
  name: string
  value: number
  color: string
}

export const MOCK_MEMBERSHIP_PIE_DATA: MembershipPieSegment[] = [
  { name: 'Premium', value: 340, color: '#3B82F6' },
  { name: 'Standard', value: 380, color: '#10B981' },
  { name: 'Basic', value: 127, color: '#F59E0B' },
]

export interface RevenueChartPoint {
  name: string
  memberships: number
  training: number
  other: number
}

export const MOCK_REVENUE_CHART_DATA: RevenueChartPoint[] = [
  { name: 'Jan', memberships: 8400, training: 2400, other: 1200 },
  { name: 'Feb', memberships: 9200, training: 2800, other: 1400 },
  { name: 'Mar', memberships: 8800, training: 2600, other: 1300 },
  { name: 'Apr', memberships: 9500, training: 3000, other: 1500 },
  { name: 'May', memberships: 10100, training: 3200, other: 1600 },
  { name: 'Jun', memberships: 9800, training: 3100, other: 1550 },
]

/** Dashboard accounting page - revenue by week */
export const MOCK_ACCOUNTING_REVENUE_CHART: RevenueChartPoint[] = [
  { name: 'Week 1', memberships: 2800, training: 1398, other: 400 },
  { name: 'Week 2', memberships: 3200, training: 1500, other: 500 },
  { name: 'Week 3', memberships: 2800, training: 1200, other: 350 },
  { name: 'Week 4', memberships: 3500, training: 1800, other: 450 },
]

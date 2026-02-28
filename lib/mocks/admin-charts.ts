/**
 * Mock chart data for admin analytics and accounting.
 */

export interface UserGrowthPoint {
  month: string
  newUsers: number
  activeUsers: number
  churn: number
}

export const MOCK_USER_GROWTH_DATA: UserGrowthPoint[] = [
  { month: 'Jan', newUsers: 120, activeUsers: 980, churn: 12 },
  { month: 'Feb', newUsers: 145, activeUsers: 1050, churn: 15 },
  { month: 'Mar', newUsers: 130, activeUsers: 1120, churn: 10 },
  { month: 'Apr', newUsers: 160, activeUsers: 1200, churn: 14 },
  { month: 'May', newUsers: 180, activeUsers: 1280, churn: 11 },
  { month: 'Jun', newUsers: 195, activeUsers: 1350, churn: 13 },
]

export interface GrowthMetric {
  label: string
  value: string
  iconKey: string
  color: string
  description: string
}

export const MOCK_GROWTH_METRICS: GrowthMetric[] = [
  { label: 'Monthly Growth', value: '+15.3%', iconKey: 'TrendingUp', color: 'bg-green-500/20 text-green-400', description: 'New registrations vs last month' },
  { label: 'Retention Rate', value: '92.4%', iconKey: 'Users', color: 'bg-blue-500/20 text-blue-400', description: 'Active returning users' },
  { label: 'Avg. Session Time', value: '45m', iconKey: 'Calendar', color: 'bg-purple-500/20 text-purple-400', description: 'Per user per day' },
  { label: 'Churn Rate', value: '8.2%', iconKey: 'AlertCircle', color: 'bg-orange-500/20 text-orange-400', description: 'Monthly user churn' },
]

export interface ActiveUsersChartPoint {
  month: string
  users: number
  activeRate: number
}

export const MOCK_ACTIVE_USERS_CHART_DATA: ActiveUsersChartPoint[] = [
  { month: 'Jan', users: 2200, activeRate: 78 },
  { month: 'Feb', users: 2350, activeRate: 82 },
  { month: 'Mar', users: 2480, activeRate: 80 },
  { month: 'Apr', users: 2550, activeRate: 85 },
  { month: 'May', users: 2620, activeRate: 83 },
  { month: 'Jun', users: 2700, activeRate: 86 },
]

export interface AdminRevenueStat {
  label: string
  value: string
  change: string
  iconKey: string
  color: string
}

export const MOCK_ADMIN_REVENUE_STATS: AdminRevenueStat[] = [
  { label: 'Total Revenue', value: '$524,600', change: '+12.5% vs last month', iconKey: 'DollarSign', color: 'bg-green-500/20 text-green-400' },
  { label: 'Monthly Recurring', value: '$84,200', change: 'From active subscriptions', iconKey: 'TrendingUp', color: 'bg-blue-500/20 text-blue-400' },
  { label: 'Avg. Client Value', value: '$21,858', change: 'Per gym client', iconKey: 'Target', color: 'bg-purple-500/20 text-purple-400' },
  { label: 'Pending Payments', value: '$8,450', change: 'Awaiting settlement', iconKey: 'Calendar', color: 'bg-orange-500/20 text-orange-400' },
]

export interface AdminRevenueChartPoint {
  month: string
  revenue: number
  subscriptions: number
  oneTime: number
}

export const MOCK_ADMIN_REVENUE_CHART_DATA: AdminRevenueChartPoint[] = [
  { month: 'Jan', revenue: 18500, subscriptions: 15000, oneTime: 3500 },
  { month: 'Feb', revenue: 21200, subscriptions: 17200, oneTime: 4000 },
  { month: 'Mar', revenue: 19800, subscriptions: 16000, oneTime: 3800 },
  { month: 'Apr', revenue: 22400, subscriptions: 18200, oneTime: 4200 },
  { month: 'May', revenue: 23800, subscriptions: 19400, oneTime: 4400 },
  { month: 'Jun', revenue: 24800, subscriptions: 20200, oneTime: 4600 },
]

/**
 * Mock KPIs for dashboard overview.
 * iconKey maps to Lucide icon name in the consuming component.
 */
export interface DashboardKpi {
  title: string
  value: string
  change: number
  iconKey: 'DollarSign' | 'Users' | 'Scan' | 'TrendingUp'
  color: string
}

export const MOCK_DASHBOARD_KPIS: DashboardKpi[] = [
  { title: 'Revenue', value: '$12,450', change: 12.5, iconKey: 'DollarSign', color: 'text-primary' },
  { title: 'Active Members', value: '847', change: 8.2, iconKey: 'Users', color: 'text-emerald-400' },
  { title: 'Check-ins Today', value: '156', change: 5.1, iconKey: 'Scan', color: 'text-amber-400' },
  { title: 'Growth', value: '23.5%', change: 3.8, iconKey: 'TrendingUp', color: 'text-primary' },
]

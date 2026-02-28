/**
 * Mock KPIs for admin dashboard.
 * iconKey maps to Lucide icon in the consuming component.
 */
export interface AdminKpi {
  label: string
  value: string
  change: string
  iconKey: 'Building2' | 'TrendingUp' | 'Users' | 'DollarSign'
  color: string
}

export const MOCK_ADMIN_KPIS: AdminKpi[] = [
  { label: 'Total Clients', value: '24', change: '+2 this month', iconKey: 'Building2', color: 'bg-blue-500/20 text-blue-400' },
  { label: 'Total Branches', value: '67', change: '+8 branches', iconKey: 'TrendingUp', color: 'bg-green-500/20 text-green-400' },
  { label: 'Active Users', value: '2,451', change: '+12% vs last month', iconKey: 'Users', color: 'bg-purple-500/20 text-purple-400' },
  { label: 'Total Revenue', value: '$124,560', change: '+18% vs last month', iconKey: 'DollarSign', color: 'bg-orange-500/20 text-orange-400' },
]

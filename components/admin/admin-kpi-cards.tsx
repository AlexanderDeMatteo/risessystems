import { Card } from '@/components/ui/card'
import { TrendingUp, Building2, Users, DollarSign } from 'lucide-react'

export function AdminKPICards() {
  const kpis = [
    {
      label: 'Total Clients',
      value: '24',
      change: '+2 this month',
      icon: Building2,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      label: 'Total Branches',
      value: '67',
      change: '+8 branches',
      icon: TrendingUp,
      color: 'bg-green-500/20 text-green-400',
    },
    {
      label: 'Active Users',
      value: '2,451',
      change: '+12% vs last month',
      icon: Users,
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      label: 'Total Revenue',
      value: '$124,560',
      change: '+18% vs last month',
      icon: DollarSign,
      color: 'bg-orange-500/20 text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} className="bg-card border-border p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-medium">{kpi.label}</p>
                <div className={`${kpi.color} rounded-lg p-2`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

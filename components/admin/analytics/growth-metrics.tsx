import { Card } from '@/components/ui/card'
import { TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react'

export function GrowthMetrics() {
  const metrics = [
    {
      label: 'Monthly Growth',
      value: '+15.3%',
      icon: TrendingUp,
      color: 'bg-green-500/20 text-green-400',
      description: 'New registrations vs last month'
    },
    {
      label: 'Retention Rate',
      value: '92.4%',
      icon: Users,
      color: 'bg-blue-500/20 text-blue-400',
      description: 'Active returning users'
    },
    {
      label: 'Avg. Session Time',
      value: '45m',
      icon: Calendar,
      color: 'bg-purple-500/20 text-purple-400',
      description: 'Per user per day'
    },
    {
      label: 'Churn Rate',
      value: '8.2%',
      icon: AlertCircle,
      color: 'bg-orange-500/20 text-orange-400',
      description: 'Monthly user churn'
    },
  ]

  return (
    <div className="space-y-3">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.label} className="bg-card border-border p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs font-medium">{metric.label}</p>
                <div className={`${metric.color} rounded p-1.5`}>
                  <Icon className="w-3 h-3" />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

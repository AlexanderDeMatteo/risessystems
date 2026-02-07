import { Card } from '@/components/ui/card'
import { DollarSign, TrendingUp, Calendar, Target } from 'lucide-react'

export function RevenueStats() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '$524,600',
      change: '+12.5% vs last month',
      icon: DollarSign,
      color: 'bg-green-500/20 text-green-400',
    },
    {
      label: 'Monthly Recurring',
      value: '$84,200',
      change: 'From active subscriptions',
      icon: TrendingUp,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      label: 'Avg. Client Value',
      value: '$21,858',
      change: 'Per gym client',
      icon: Target,
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      label: 'Pending Payments',
      value: '$8,450',
      change: 'Awaiting settlement',
      icon: Calendar,
      color: 'bg-orange-500/20 text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="bg-card border-border p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                <div className={`${stat.color} rounded-lg p-2`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

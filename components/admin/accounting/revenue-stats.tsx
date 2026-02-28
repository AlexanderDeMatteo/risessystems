import { Card } from '@/components/ui/card'
import { DollarSign, TrendingUp, Calendar, Target } from 'lucide-react'
import { MOCK_ADMIN_REVENUE_STATS } from '@/lib/mocks/admin-charts'

const revenueStatIconMap = { DollarSign, TrendingUp, Target, Calendar } as const

export function RevenueStats() {
  const stats = MOCK_ADMIN_REVENUE_STATS.map((s) => ({ ...s, icon: revenueStatIconMap[s.iconKey as keyof typeof revenueStatIconMap] }))

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

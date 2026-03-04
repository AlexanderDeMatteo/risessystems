import { Card } from '@/components/ui/card'
import { TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react'
import type { GrowthMetric } from '@/app/actions/admin'

const growthIconMap = { TrendingUp, Users, Calendar, AlertCircle } as const

interface GrowthMetricsProps {
  metrics: GrowthMetric[]
}

export function GrowthMetrics({ metrics }: GrowthMetricsProps) {
  const metricsWithIcons = metrics.map((m) => ({ ...m, icon: growthIconMap[m.iconKey as keyof typeof growthIconMap] }))

  return (
    <div className="space-y-3">
      {metricsWithIcons.map((metric) => {
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

import { Card } from '@/components/ui/card'
import { TrendingUp, Building2, Users, DollarSign } from 'lucide-react'
import { MOCK_ADMIN_KPIS } from '@/lib/mocks/admin-kpis'

const adminIconMap = { Building2, TrendingUp, Users, DollarSign } as const

export function AdminKPICards() {
  const kpis = MOCK_ADMIN_KPIS.map((k) => ({ ...k, icon: adminIconMap[k.iconKey] }))

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

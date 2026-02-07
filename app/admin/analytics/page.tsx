import { AnalyticsHeader } from '@/components/admin/analytics/analytics-header'
import { UserGrowthChart } from '@/components/admin/analytics/user-growth-chart'
import { GrowthMetrics } from '@/components/admin/analytics/growth-metrics'

export default function AnalyticsPage() {
  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <AnalyticsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserGrowthChart />
          </div>
          <div>
            <GrowthMetrics />
          </div>
        </div>
      </div>
    </main>
  )
}

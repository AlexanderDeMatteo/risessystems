import { getTranslations } from 'next-intl/server'
import { AnalyticsHeader } from '@/components/admin/analytics/analytics-header'
import { UserGrowthChart } from '@/components/admin/analytics/user-growth-chart'
import { GrowthMetrics } from '@/components/admin/analytics/growth-metrics'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getAdminUserGrowthData, getAdminGrowthMetrics } from '@/app/actions/admin'

export default async function AdminAnalyticsPage() {
  const t = await getTranslations('admin')
  const [userGrowthResult, growthMetricsResult] = await Promise.all([
    getAdminUserGrowthData(6),
    getAdminGrowthMetrics(),
  ])
  const userGrowthData = userGrowthResult.data
  const growthMetrics = growthMetricsResult.data
  const analyticsErrors = [userGrowthResult.error, growthMetricsResult.error].filter(Boolean) as string[]

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {analyticsErrors.length > 0 && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('couldNotLoadAnalytics')}</AlertTitle>
            <AlertDescription>{analyticsErrors.join('; ')}</AlertDescription>
          </Alert>
        )}
        <AnalyticsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserGrowthChart data={userGrowthData} />
          </div>
          <div>
            <GrowthMetrics metrics={growthMetrics} />
          </div>
        </div>
      </div>
    </main>
  )
}

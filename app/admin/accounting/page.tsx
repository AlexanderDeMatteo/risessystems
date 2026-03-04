import { AccountingHeader } from '@/components/admin/accounting/accounting-header'
import { RevenueStats } from '@/components/admin/accounting/revenue-stats'
import { RevenueChart } from '@/components/admin/accounting/revenue-chart'
import { PlatformPaymentsTable } from '@/components/admin/accounting/platform-payments-table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import {
  getAdminPlatformRevenueStats,
  getAdminPlatformRevenueChartData,
  getAdminPlatformPayments,
  getAdminClients,
  getPlatformPlans,
} from '@/app/actions/admin'

export default async function AdminAccountingPage() {
  const [revenueStatsResult, revenueChartResult, paymentsResult, clientsResult, plansResult] = await Promise.all([
    getAdminPlatformRevenueStats(),
    getAdminPlatformRevenueChartData(6),
    getAdminPlatformPayments(50),
    getAdminClients(),
    getPlatformPlans(),
  ])
  const revenueStats = revenueStatsResult.data
  const revenueChartData = revenueChartResult.data
  const payments = paymentsResult.data
  const clients = clientsResult.data
  const plans = plansResult.data
  const clientOptions = (clients ?? []).map((c) => ({ id: c.id, name: c.name }))
  const clientActiveUsers: Record<number, number> = {}
  for (const c of clients ?? []) {
    clientActiveUsers[c.id] = c.activeUsers
  }
  const accountingErrors = [
    revenueStatsResult.error,
    revenueChartResult.error,
    paymentsResult.error,
    clientsResult.error,
    plansResult.error,
  ].filter(Boolean) as string[]

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {accountingErrors.length > 0 && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Could not load accounting data</AlertTitle>
            <AlertDescription>{accountingErrors.join('; ')}</AlertDescription>
          </Alert>
        )}
        <AccountingHeader />

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Financial Overview</h2>
          <RevenueStats stats={revenueStats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueChartData} />
          </div>
        </div>

        <PlatformPaymentsTable
          payments={payments}
          clients={clientOptions}
          plans={plans}
          clientActiveUsers={clientActiveUsers}
        />
      </div>
    </main>
  )
}

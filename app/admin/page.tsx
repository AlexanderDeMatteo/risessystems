import { AdminDashboardHeader } from '@/components/admin/admin-dashboard-header'
import { AdminKPICards } from '@/components/admin/admin-kpi-cards'
import { ActiveUsersChart } from '@/components/admin/active-users-chart'
import { ClientsOverview } from '@/components/admin/clients-overview'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getAdminKPIs, getAdminClientsOverview, getAdminActiveUsersChartData } from '@/app/actions/admin'

export default async function AdminDashboard() {
  const [kpisResult, clientsOverviewResult, activeUsersChartResult] = await Promise.all([
    getAdminKPIs(),
    getAdminClientsOverview(5),
    getAdminActiveUsersChartData(6),
  ])
  const kpis = kpisResult.data
  const clientsOverview = clientsOverviewResult.data
  const activeUsersChartData = activeUsersChartResult.data
  const adminErrors = [kpisResult.error, clientsOverviewResult.error, activeUsersChartResult.error].filter(Boolean) as string[]

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {adminErrors.length > 0 && (
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Could not load some data</AlertTitle>
              <AlertDescription>{adminErrors.join('; ')}</AlertDescription>
            </Alert>
          )}
          {/* Header */}
          <AdminDashboardHeader />

          {/* KPI Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
            <AdminKPICards kpis={kpis} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActiveUsersChart data={activeUsersChartData} />
            </div>
            <div>
              <ClientsOverview clients={clientsOverview} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

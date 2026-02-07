import { AdminDashboardHeader } from '@/components/admin/admin-dashboard-header'
import { AdminKPICards } from '@/components/admin/admin-kpi-cards'
import { ActiveUsersChart } from '@/components/admin/active-users-chart'
import { ClientsOverview } from '@/components/admin/clients-overview'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <AdminDashboardHeader />

          {/* KPI Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
            <AdminKPICards />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActiveUsersChart />
            </div>
            <div>
              <ClientsOverview />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

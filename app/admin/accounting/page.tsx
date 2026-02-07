import { AccountingHeader } from '@/components/admin/accounting/accounting-header'
import { RevenueStats } from '@/components/admin/accounting/revenue-stats'
import { RevenueChart } from '@/components/admin/accounting/revenue-chart'
import { PaymentsTable } from '@/components/admin/accounting/payments-table'

export default function AccountingPage() {
  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <AccountingHeader />

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Financial Overview</h2>
          <RevenueStats />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
        </div>

        <PaymentsTable />
      </div>
    </main>
  )
}

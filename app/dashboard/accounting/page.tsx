'use client'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { RevenueStats } from '@/components/accounting/revenue-stats'
import { PaymentsTable } from '@/components/accounting/payments-table'
import { RevenueChart } from '@/components/accounting/revenue-chart'
import { Card } from '@/components/ui/card'

export default function AccountingPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accounting</h1>
            <p className="text-muted-foreground mt-1">Track revenue and payments</p>
          </div>

          {/* Revenue stats */}
          <RevenueStats />

          {/* Charts and tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue chart */}
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>

            {/* Payment methods breakdown */}
            <Card className="bg-card border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cash</span>
                  <span className="font-medium text-foreground">35%</span>
                </div>
                <div className="bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[35%]" />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground">Card</span>
                  <span className="font-medium text-foreground">55%</span>
                </div>
                <div className="bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-[55%]" />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground">Bank Transfer</span>
                  <span className="font-medium text-foreground">10%</span>
                </div>
                <div className="bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-chart-2 h-full w-[10%]" />
                </div>
              </div>
            </Card>
          </div>

          {/* Payments table */}
          <PaymentsTable />
        </div>
      </main>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Scan, DollarSign, TrendingUp } from 'lucide-react'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { MemberInsights } from '@/components/dashboard/member-insights'
import { RevenueChart } from '@/components/accounting/revenue-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function DashboardPage() {
  const kpis = [
    { title: 'Revenue', value: '$12,450', change: 12.5, icon: DollarSign, color: 'text-primary' },
    { title: 'Active Members', value: '847', change: 8.2, icon: Users, color: 'text-emerald-400' },
    { title: 'Check-ins Today', value: '156', change: 5.1, icon: Scan, color: 'text-amber-400' },
    { title: 'Growth', value: '23.5%', change: 3.8, icon: TrendingUp, color: 'text-primary' },
  ]

  return (
    <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title */}
          <div>
            <h2 className="text-4xl font-bold text-foreground tracking-wider">OVERVIEW</h2>
            <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">Welcome back to your gym management hub</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon
              return (
                <Card key={index} className="border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {kpi.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${kpi.color} bg-primary/15 transition-all duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-foreground font-mono">{kpi.value}</p>
                      <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">+{kpi.change}% MoM</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Charts Row 1: Sales + Member Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SalesChart />
            </div>
            <div>
              <MemberInsights />
            </div>
          </div>

          {/* Chart Row 2: Revenue Trend */}
          <RevenueChart />

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-primary">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground font-mono">1,247</p>
                <p className="text-xs text-muted-foreground mt-2">+125 this month</p>
              </CardContent>
            </Card>
            <Card className="border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-primary">Active Trainers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground font-mono">24</p>
                <p className="text-xs text-muted-foreground mt-2">Across all branches</p>
              </CardContent>
            </Card>
            <Card className="border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-primary">Branches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground font-mono">4</p>
                <p className="text-xs text-muted-foreground mt-2">Operational locations</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <QuickActions />
          </div>
        </div>
    </main>
  )
}

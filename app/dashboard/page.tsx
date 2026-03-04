import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Users, Scan, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { MemberInsights } from '@/components/dashboard/member-insights'
import { RevenueChart } from '@/components/accounting/revenue-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import {
  getDashboardCounts,
  getSalesChartData,
  getMembershipDistribution,
  getRevenueChartData,
  getRecentActivity,
} from '@/app/actions/dashboard'

const iconMap = { DollarSign, Users, Scan, TrendingUp } as const
type IconKey = keyof typeof iconMap

export default async function DashboardPage() {
  const [countsResult, salesResult, membershipResult, revenueResult, activities] = await Promise.all([
    getDashboardCounts(),
    getSalesChartData(30),
    getMembershipDistribution(),
    getRevenueChartData(6),
    getRecentActivity(10),
  ])
  const counts = countsResult.counts
  const countsError = countsResult.error
  const salesData = salesResult.data
  const membershipData = membershipResult.data
  const revenueData = revenueResult.data
  const chartErrors = [salesResult.error, membershipResult.error, revenueResult.error].filter(Boolean) as string[]
  const chartsError = chartErrors.length > 0 ? chartErrors.join('; ') : null

  const growthPct =
    counts.revenueLastMonth > 0
      ? ((counts.revenueThisMonth - counts.revenueLastMonth) / counts.revenueLastMonth) * 100
      : 0

  const kpis = [
    {
      title: 'Revenue',
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(counts.revenueThisMonth),
      change: Math.round(growthPct * 10) / 10,
      iconKey: 'DollarSign' as IconKey,
      color: 'text-primary',
    },
    {
      title: 'Active Members',
      value: String(counts.memberCount),
      change: counts.memberCount > 0 && counts.membersThisMonth > 0 ? Math.round((counts.membersThisMonth / counts.memberCount) * 1000) / 10 : 0,
      iconKey: 'Users' as IconKey,
      color: 'text-emerald-400',
    },
    {
      title: 'Check-ins Today',
      value: String(counts.checkInsToday),
      change: 0,
      iconKey: 'Scan' as IconKey,
      color: 'text-amber-400',
    },
    {
      title: 'Growth',
      value: `${Math.round(growthPct * 10) / 10}%`,
      change: Math.round(growthPct * 10) / 10,
      iconKey: 'TrendingUp' as IconKey,
      color: 'text-primary',
    },
  ]

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {countsError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Could not load overview</AlertTitle>
            <AlertDescription>{countsError}</AlertDescription>
          </Alert>
        )}
        {chartsError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Could not load some charts</AlertTitle>
            <AlertDescription>{chartsError}</AlertDescription>
          </Alert>
        )}
        <div>
          <h2 className="text-4xl font-bold text-foreground tracking-wider">OVERVIEW</h2>
          <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">Welcome back to your gym management hub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = iconMap[kpi.iconKey]
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart data={salesData} />
          </div>
          <div>
            <MemberInsights data={membershipData} />
          </div>
        </div>

        <RevenueChart data={revenueData} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-primary">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground font-mono">{counts.memberCount}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {counts.membersThisMonth > 0 ? `+${counts.membersThisMonth} this month` : 'No new members this month'}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-primary">Active Trainers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground font-mono">{counts.trainerCount}</p>
              <p className="text-xs text-muted-foreground mt-2">Across all branches</p>
            </CardContent>
          </Card>
          <Card className="border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-primary">Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground font-mono">{counts.branchCount}</p>
              <p className="text-xs text-muted-foreground mt-2">Operational locations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={activities} />
          <QuickActions />
        </div>
      </div>
    </main>
  )
}

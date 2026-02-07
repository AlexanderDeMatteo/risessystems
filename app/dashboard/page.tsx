import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Dumbbell, MapPin, Scan, DollarSign, TrendingUp, LayoutDashboard } from 'lucide-react'

export default function DashboardPage() {
  const kpis = [
    { title: 'Revenue', value: '$12,450', change: 12.5, icon: DollarSign, color: 'text-primary' },
    { title: 'Active Members', value: '847', change: 8.2, icon: Users, color: 'text-emerald-400' },
    { title: 'Check-ins Today', value: '156', change: 5.1, icon: Scan, color: 'text-amber-400' },
    { title: 'Growth', value: '23.5%', change: 3.8, icon: TrendingUp, color: 'text-primary' },
  ]

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/members', label: 'Members', icon: Users },
    { href: '/dashboard/trainers', label: 'Trainers', icon: Dumbbell },
    { href: '/dashboard/branches', label: 'Branches', icon: MapPin },
    { href: '/dashboard/qr-scanner', label: 'QR Scanner', icon: Scan },
    { href: '/dashboard/accounting', label: 'Accounting', icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card shadow-[0_0_20px_rgba(163,230,53,0.1)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Top bar */}
          <div className="py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.3)] group-hover:shadow-[0_0_25px_rgba(163,230,53,0.4)] transition-all">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-wider">RISESYSTEM</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Gym Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 border-t border-border/30 pt-4 pb-0 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.href === '/dashboard'
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all duration-300 uppercase tracking-wider text-xs font-semibold ${
                      isActive
                        ? 'bg-secondary/50 border-primary text-primary shadow-[0_0_10px_rgba(163,230,53,0.2)]'
                        : 'border-transparent text-muted-foreground hover:text-primary hover:border-primary/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

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
        </div>
      </main>
    </div>
  )
}

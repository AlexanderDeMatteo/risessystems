'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, CreditCard, DollarSign, Wallet } from 'lucide-react'
import type { AccountingStats } from '@/app/actions/payments'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

interface RevenueStatsProps {
  stats: AccountingStats
  activeMembersCount: number
}

export function RevenueStats({ stats, activeMembersCount }: RevenueStatsProps) {
  const changeLabel =
    stats.revenueChangePercent >= 0
      ? `+${stats.revenueChangePercent}% from last month`
      : `${stats.revenueChangePercent}% from last month`
  const changePositive = stats.revenueChangePercent >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <Card className="bg-card border-border p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Total Revenue</p>
            <div className="bg-primary/20 rounded-lg p-2">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenueThisMonth)}</p>
          <p className={`text-xs flex items-center gap-1 ${changePositive ? 'text-green-500' : 'text-red-500'}`}>
            {changePositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {changeLabel}
          </p>
        </div>
      </Card>

      {/* Membership Fees */}
      <Card className="bg-card border-border p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Membership Fees</p>
            <div className="bg-accent/20 rounded-lg p-2">
              <CreditCard className="w-4 h-4 text-accent" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.membershipFeesThisMonth)}</p>
          <p className="text-xs text-muted-foreground">{activeMembersCount} active members</p>
        </div>
      </Card>

      {/* Personal Training */}
      <Card className="bg-card border-border p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Personal Training</p>
            <div className="bg-chart-2/20 rounded-lg p-2">
              <Wallet className="w-4 h-4 text-chart-2" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.personalTrainingThisMonth)}</p>
          <p className="text-xs text-muted-foreground">{stats.personalTrainingCountThisWeek} sessions this week</p>
        </div>
      </Card>

      {/* Pending Payments */}
      <Card className="bg-card border-border p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Pending Payments</p>
            <div className="bg-yellow-900/20 rounded-lg p-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.pendingAmount)}</p>
          <p className="text-xs text-muted-foreground">{stats.pendingCount} pending invoices</p>
        </div>
      </Card>
    </div>
  )
}

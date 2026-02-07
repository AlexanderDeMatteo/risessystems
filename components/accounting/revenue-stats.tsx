'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, CreditCard, DollarSign, Wallet } from 'lucide-react'

export function RevenueStats() {
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
          <p className="text-2xl font-bold text-foreground">$12,850</p>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12% from last month
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
          <p className="text-2xl font-bold text-foreground">$8,400</p>
          <p className="text-xs text-muted-foreground">45 active members</p>
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
          <p className="text-2xl font-bold text-foreground">$2,950</p>
          <p className="text-xs text-muted-foreground">12 sessions this week</p>
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
          <p className="text-2xl font-bold text-foreground">$1,500</p>
          <p className="text-xs text-muted-foreground">3 pending invoices</p>
        </div>
      </Card>
    </div>
  )
}

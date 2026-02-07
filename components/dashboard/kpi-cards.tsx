'use client'

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign, LogIn } from 'lucide-react'

interface KPICard {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  color: string
}

const kpis: KPICard[] = [
  {
    title: 'Revenue',
    value: '$12,450',
    change: 12.5,
    icon: <DollarSign className="w-6 h-6" />,
    color: 'bg-primary/15 text-primary',
  },
  {
    title: 'Active Members',
    value: '847',
    change: 8.2,
    icon: <Users className="w-6 h-6" />,
    color: 'bg-success/15 text-success',
  },
  {
    title: 'Today\'s Check-ins',
    value: '156',
    change: 5.1,
    icon: <LogIn className="w-6 h-6" />,
    color: 'bg-warning/15 text-warning',
  },
  {
    title: 'Growth',
    value: '23.5%',
    change: 3.8,
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-primary/15 text-primary',
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="card-cyber group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.color} transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(163,230,53,0.3)]`}>
                {kpi.icon}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-3xl font-bold text-foreground font-mono tracking-tight">{kpi.value}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-success font-semibold uppercase tracking-wider">
                  +{kpi.change}%
                </p>
                <p className="text-xs text-muted-foreground">MoM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

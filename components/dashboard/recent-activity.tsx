'use client'

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, LogIn, CreditCard, AlertCircle } from 'lucide-react'

interface Activity {
  id: string
  type: 'member_added' | 'checkin' | 'payment' | 'alert'
  description: string
  member: string
  time: string
  icon: React.ReactNode
  color: string
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'member_added',
    description: 'New member registered',
    member: 'John Doe',
    time: '2 hours ago',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    id: '2',
    type: 'checkin',
    description: 'Member check-in',
    member: 'Sarah Smith',
    time: '45 minutes ago',
    icon: <LogIn className="w-4 h-4" />,
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    id: '3',
    type: 'payment',
    description: 'Payment received',
    member: 'Mike Johnson',
    time: '1 hour ago',
    icon: <CreditCard className="w-4 h-4" />,
    color: 'bg-purple-500/10 text-purple-400',
  },
  {
    id: '4',
    type: 'alert',
    description: 'Membership expiring soon',
    member: 'Emma Wilson',
    time: '3 hours ago',
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'bg-amber-500/10 text-amber-400',
  },
  {
    id: '5',
    type: 'checkin',
    description: 'Member check-in',
    member: 'David Lee',
    time: '5 hours ago',
    icon: <LogIn className="w-4 h-4" />,
    color: 'bg-blue-500/10 text-blue-400',
  },
]

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${activity.color} flex-shrink-0 mt-1`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{activity.member}</p>
                  <Badge
                    variant="outline"
                    className="text-xs border-border bg-secondary/50"
                  >
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground/70">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

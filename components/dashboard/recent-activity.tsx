'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, LogIn, CreditCard, AlertCircle } from 'lucide-react'

export type ActivityType = 'member_added' | 'checkin' | 'payment' | 'alert'

export interface RecentActivityItem {
  id: string
  type: ActivityType
  description: string
  member: string
  time: string
  color: string
}

const activityIcons: Record<ActivityType, React.ReactNode> = {
  member_added: <CheckCircle2 className="w-4 h-4" />,
  checkin: <LogIn className="w-4 h-4" />,
  payment: <CreditCard className="w-4 h-4" />,
  alert: <AlertCircle className="w-4 h-4" />,
}

interface RecentActivityProps {
  activities?: RecentActivityItem[]
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  const t = useTranslations('recentActivity')

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noActivity')}</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${activity.color} flex-shrink-0 mt-1`}>
                  {activityIcons[activity.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{activity.member}</p>
                    <Badge
                      variant="outline"
                      className="text-xs border-border bg-secondary/50"
                    >
                      {t(`types.${activity.type}`)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground/70">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

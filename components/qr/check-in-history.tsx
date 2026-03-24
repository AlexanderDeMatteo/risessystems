'use client'

import { useState, useCallback } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, User, LogOut } from 'lucide-react'
import { createCheckOut } from '@/app/actions/check-ins'

export type CheckInItem = {
  id: number
  check_in_time: string
  check_out_time?: string | null
  duration_minutes?: number | null
  member_name: string
}

interface CheckInHistoryProps {
  checkIns?: CheckInItem[]
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function CheckInHistory({ checkIns = [] }: CheckInHistoryProps) {
  const router = useRouter()
  const t = useTranslations('qr')
  const [checkingOutId, setCheckingOutId] = useState<number | null>(null)

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return t('justNow')
    if (minutes < 60) return t('minutesAgo', { minutes })
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return t('hoursAgo', { hours })
    return date.toLocaleDateString()
  }

  const handleCheckOut = useCallback(
    async (id: number) => {
      setCheckingOutId(id)
      const result = await createCheckOut(id)
      setCheckingOutId(null)
      if (result.ok) router.refresh()
    },
    [router]
  )

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('checkInHistory')}</h2>
          <p className="text-sm text-muted-foreground">{t('recentCheckIns')}</p>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {checkIns.length > 0 ? (
            checkIns.map((checkin) => {
              const isCheckedOut = !!checkin.check_out_time
              return (
                <div
                  key={checkin.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 rounded-lg p-2">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{checkin.member_name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(checkin.check_in_time)}
                        {isCheckedOut && checkin.duration_minutes != null && (
                          <span className="ml-2">· {formatDuration(checkin.duration_minutes)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCheckedOut ? (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        {t('checkedOut')}
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-border bg-transparent"
                        onClick={() => handleCheckOut(checkin.id)}
                        disabled={checkingOutId === checkin.id}
                      >
                        <LogOut className="w-3 h-3" />
                        {checkingOutId === checkin.id ? t('checkingOut') : t('checkOut')}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('noCheckIns')}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

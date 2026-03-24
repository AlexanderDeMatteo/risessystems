'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import {
  Bell,
  UserPlus,
  CreditCard,
  AlertTriangle,
  Scan,
  Clock,
  UserMinus,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getReadIds, addReadId, addReadIds } from '@/lib/notification-reads'
import type { NotificationType, NotificationItem } from '@/lib/types/notifications'

const notificationConfig: Partial<Record<
  NotificationType,
  { icon: typeof Bell; colorClass: string }
>> = {
  expiring: { icon: AlertTriangle, colorClass: 'text-amber-400 bg-amber-400/10' },
  payment: { icon: CreditCard, colorClass: 'text-emerald-400 bg-emerald-400/10' },
  new_member: { icon: UserPlus, colorClass: 'text-primary bg-primary/10' },
  checkin: { icon: Scan, colorClass: 'text-blue-400 bg-blue-400/10' },
  payment_pending: { icon: Clock, colorClass: 'text-amber-400 bg-amber-400/10' },
  expired: { icon: UserMinus, colorClass: 'text-destructive bg-destructive/10' },
}

type Props = { items: NotificationItem[] }

export function NotificationsList({ items }: Props) {
  const t = useTranslations('notifications')
  const tCommon = useTranslations('common')
  const router = useRouter()

  const filterOptions: { value: NotificationType | 'all'; label: string }[] = useMemo(() => [
    { value: 'all', label: tCommon('all') },
    { value: 'expiring', label: t('expiring') },
    { value: 'expired', label: t('expired') },
    { value: 'payment', label: t('payments') },
    { value: 'payment_pending', label: tCommon('pending') },
    { value: 'checkin', label: t('checkIns') },
    { value: 'new_member', label: t('newMembers') },
  ], [t, tCommon])

  const timeAgo = useCallback((iso: string): string => {
    const d = new Date(iso)
    const sec = Math.floor((Date.now() - d.getTime()) / 1000)
    if (sec < 0) return t('upcoming')
    if (sec < 60) return t('justNow')
    if (sec < 3600) return t('minutesAgo', { minutes: Math.floor(sec / 60) })
    if (sec < 86400) return t('hoursAgo', { hours: Math.floor(sec / 3600) })
    const days = Math.floor(sec / 86400)
    if (days === 1) return t('yesterday')
    if (days < 7) return t('daysAgo', { days })
    return d.toLocaleDateString()
  }, [t])
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<NotificationType | 'all'>('all')
  const [readIds, setReadIds] = useState<Set<string>>(() => getReadIds())

  useEffect(() => setMounted(true), [])

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter(n => n.type === filter)),
    [items, filter],
  )

  const unreadCount = items.filter(n => !readIds.has(n.id)).length

  const handleClick = useCallback(
    (n: NotificationItem) => {
      addReadId(n.id)
      setReadIds(prev => new Set([...prev, n.id]))
      router.push(n.href)
    },
    [router],
  )

  const markAllAsRead = useCallback(() => {
    const allIds = items.map(n => n.id)
    addReadIds(allIds)
    setReadIds(prev => {
      const next = new Set(prev)
      for (const id of allIds) next.add(id)
      return next
    })
  }, [items])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(opt => (
            <Button
              key={opt.value}
              variant={filter === opt.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(opt.value)}
              className={`uppercase text-[10px] tracking-widest font-semibold ${
                filter === opt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary'
              }`}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="uppercase text-[10px] tracking-widest font-semibold text-muted-foreground hover:text-primary"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            {t('markAllRead')}
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-border/50 p-12 text-center">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            {t('noNotifications')}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {filter !== 'all' ? t('tryDifferentFilter') : t('allCaughtUp')}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(notification => {
            const config = notificationConfig[notification.type] ?? { icon: Bell, colorClass: 'text-muted-foreground bg-muted' }
            const Icon = config.icon
            const isRead = readIds.has(notification.id)
            return (
              <button
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={`w-full text-left flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 hover:bg-secondary/50 hover:border-primary/30 ${
                  !isRead
                    ? 'border-l-2 border-l-primary bg-primary/5 border-border/50'
                    : 'border-l-2 border-l-transparent border-border/30'
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${config.colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        !isRead ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground/70 shrink-0" suppressHydrationWarning>
                      {mounted ? timeAgo(notification.timestamp) : '\u00A0'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                </div>
                {!isRead && (
                  <div className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0 neon-glow-sm" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

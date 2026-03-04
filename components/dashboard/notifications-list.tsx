'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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

const notificationConfig: Record<
  NotificationType,
  { icon: typeof Bell; colorClass: string; label: string }
> = {
  expiring: { icon: AlertTriangle, colorClass: 'text-amber-400 bg-amber-400/10', label: 'Expiring' },
  payment: { icon: CreditCard, colorClass: 'text-emerald-400 bg-emerald-400/10', label: 'Payments' },
  new_member: { icon: UserPlus, colorClass: 'text-primary bg-primary/10', label: 'New Members' },
  checkin: { icon: Scan, colorClass: 'text-blue-400 bg-blue-400/10', label: 'Check-ins' },
  payment_pending: { icon: Clock, colorClass: 'text-amber-400 bg-amber-400/10', label: 'Pending' },
  expired: { icon: UserMinus, colorClass: 'text-destructive bg-destructive/10', label: 'Expired' },
}

const filterOptions: { value: NotificationType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'expiring', label: 'Expiring' },
  { value: 'expired', label: 'Expired' },
  { value: 'payment', label: 'Payments' },
  { value: 'payment_pending', label: 'Pending' },
  { value: 'checkin', label: 'Check-ins' },
  { value: 'new_member', label: 'New Members' },
]

function timeAgo(iso: string): string {
  const d = new Date(iso)
  const sec = Math.floor((Date.now() - d.getTime()) / 1000)
  if (sec < 0) return 'Upcoming'
  if (sec < 60) return 'Just now'
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`
  const days = Math.floor(sec / 86400)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

type Props = { items: NotificationItem[] }

export function NotificationsList({ items }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<NotificationType | 'all'>('all')
  const [readIds, setReadIds] = useState<Set<string>>(() => getReadIds())

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
            Mark all read
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-border/50 p-12 text-center">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            No notifications
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {filter !== 'all' ? 'Try a different filter' : 'You\'re all caught up'}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(notification => {
            const config = notificationConfig[notification.type]
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
                    <span className="text-[10px] text-muted-foreground/70 shrink-0">
                      {timeAgo(notification.timestamp)}
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

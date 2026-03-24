'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { Bell, UserPlus, CreditCard, AlertTriangle, Scan, Clock, UserMinus, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getNotifications } from '@/app/actions/notifications'
import { getReadIds, addReadId, addReadIds } from '@/lib/notification-reads'
import type { NotificationType, NotificationItem } from '@/lib/types/notifications'

const notificationConfig: Record<string, { icon: typeof Bell; colorClass: string }> = {
  expiring: { icon: AlertTriangle, colorClass: 'text-amber-400 bg-amber-400/10' },
  payment: { icon: CreditCard, colorClass: 'text-emerald-400 bg-emerald-400/10' },
  new_member: { icon: UserPlus, colorClass: 'text-primary bg-primary/10' },
  checkin: { icon: Scan, colorClass: 'text-blue-400 bg-blue-400/10' },
  payment_pending: { icon: Clock, colorClass: 'text-amber-400 bg-amber-400/10' },
  expired: { icon: UserMinus, colorClass: 'text-destructive bg-destructive/10' },
}

export function NotificationsPopover() {
  const t = useTranslations('notifications')
  const tCommon = useTranslations('common')
  const router = useRouter()

  const timeAgo = useCallback((iso: string): string => {
    const d = new Date(iso)
    const sec = Math.floor((Date.now() - d.getTime()) / 1000)
    if (sec < 0) return t('upcoming')
    if (sec < 60) return t('justNow')
    if (sec < 3600) return t('minutesAgo', { minutes: Math.floor(sec / 60) })
    if (sec < 86400) return t('hoursAgo', { hours: Math.floor(sec / 3600) })
    const days = Math.floor(sec / 86400)
    if (days === 1) return t('yesterday')
    return t('daysAgo', { days })
  }, [t])
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(() => getReadIds())
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  const unreadCount = items.filter(n => !readIds.has(n.id)).length

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getNotifications(15)
      setItems(data)
      setReadIds(getReadIds())
    } finally {
      setLoading(false)
    }
  }, [])

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
      if (isOpen) fetchNotifications()
    },
    [fetchNotifications],
  )

  const handleClickNotification = useCallback(
    (notification: NotificationItem) => {
      addReadId(notification.id)
      setReadIds(prev => new Set([...prev, notification.id]))
      setOpen(false)
      router.push(notification.href)
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

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-96 p-0 bg-card border-border/50 shadow-[0_0_20px_hsl(var(--primary)_/_0.1)]"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {t('title')}
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              <Check className="w-3 h-3" />
              {t('markAllRead')}
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-8 text-center">
              <Loader2 className="w-6 h-6 text-primary mx-auto mb-2 animate-spin" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{tCommon('loading')}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {t('noNotifications')}
              </p>
            </div>
          ) : (
            items.map(notification => {
              const config = notificationConfig[notification.type] ?? { icon: Bell, colorClass: 'text-muted-foreground bg-muted' }
              const Icon = config.icon
              const isRead = readIds.has(notification.id)
              return (
                <button
                  key={notification.id}
                  onClick={() => handleClickNotification(notification)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-border/20 last:border-b-0 transition-colors hover:bg-secondary/50 ${
                    !isRead
                      ? 'border-l-2 border-l-primary bg-primary/5'
                      : 'border-l-2 border-l-transparent'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${config.colorClass}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        !isRead ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {notification.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {timeAgo(notification.timestamp)}
                    </p>
                  </div>
                  {!isRead && (
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0 neon-glow-sm" />
                  )}
                </button>
              )
            })
          )}
        </div>

        <div className="border-t border-border/30 px-4 py-2.5">
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="block w-full text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            {t('viewAll')}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}

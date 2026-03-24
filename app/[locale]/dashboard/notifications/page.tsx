import { getNotifications } from '@/app/actions/notifications'
import { NotificationsList } from '@/components/dashboard/notifications-list'
import { getTranslations } from 'next-intl/server'

export default async function NotificationsPage() {
  const [notifications, t] = await Promise.all([
    getNotifications(50),
    getTranslations('notifications'),
  ])

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-wider">
            {t('title').toUpperCase()}
          </h1>
          <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">
            {t('dashboardSubtitle')}
          </p>
        </div>

        <NotificationsList items={notifications} />
      </div>
    </main>
  )
}

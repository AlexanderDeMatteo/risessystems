import { getAdminNotifications } from '@/app/actions/admin-notifications'
import { AdminNotificationsList } from '@/components/admin/admin-notifications-list'
import { getTranslations } from 'next-intl/server'

export default async function AdminNotificationsPage() {
  const [notifications, t] = await Promise.all([
    getAdminNotifications(50),
    getTranslations('notifications'),
  ])

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-wider">{t('title').toUpperCase()}</h1>
          <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">
            {t('platformActivity')}
          </p>
        </div>

        <AdminNotificationsList items={notifications} />
      </div>
    </main>
  )
}

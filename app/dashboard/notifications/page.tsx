import { getNotifications } from '@/app/actions/notifications'
import { NotificationsList } from '@/components/dashboard/notifications-list'

export default async function NotificationsPage() {
  const notifications = await getNotifications(50)

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-wider">NOTIFICATIONS</h1>
          <p className="text-muted-foreground mt-2 uppercase text-xs tracking-widest">
            All your recent activity and alerts
          </p>
        </div>

        <NotificationsList items={notifications} />
      </div>
    </main>
  )
}

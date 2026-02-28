import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { ensureUserProfile } from '@/app/actions/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await ensureUserProfile()
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      {children}
    </div>
  )
}

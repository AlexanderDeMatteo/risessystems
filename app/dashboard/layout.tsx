import { DashboardHeader } from '@/components/dashboard/dashboard-header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      {children}
    </div>
  )
}

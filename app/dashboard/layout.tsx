import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { ColorSchemeProvider } from '@/components/color-scheme-provider'
import { ensureUserProfile } from '@/app/actions/auth'
import { getUserSettings } from '@/app/actions/settings'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await ensureUserProfile()
  const settings = await getUserSettings()

  return (
    <ColorSchemeProvider colorScheme={settings.colorScheme}>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        {children}
      </div>
    </ColorSchemeProvider>
  )
}

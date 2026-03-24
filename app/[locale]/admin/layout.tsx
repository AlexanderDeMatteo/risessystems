import React from "react"
import { AdminHeader } from '@/components/admin/admin-header'
import { ColorSchemeProvider } from '@/components/color-scheme-provider'
import { getUserSettings } from '@/app/actions/settings'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getUserSettings()

  return (
    <ColorSchemeProvider colorScheme={settings.colorScheme}>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        {children}
      </div>
    </ColorSchemeProvider>
  )
}

import { getUserSettings } from '@/app/actions/settings'
import { AdminSettingsClient } from './admin-settings-client'

export default async function AdminSettingsPage() {
  const settings = await getUserSettings()

  return <AdminSettingsClient initialSettings={settings} />
}

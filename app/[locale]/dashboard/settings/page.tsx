import { getUserSettings } from '@/app/actions/settings'
import { SettingsPageClient } from './settings-page-client'

export default async function SettingsPage() {
  const settings = await getUserSettings()

  return <SettingsPageClient initialSettings={settings} />
}

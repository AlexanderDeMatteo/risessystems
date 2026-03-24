'use client'

import { useTranslations } from 'next-intl'

export function AdminDashboardHeader() {
  const t = useTranslations('admin')

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboardTitle')}</h1>
        <p className="text-muted-foreground mt-1">{t('dashboardSubtitle')}</p>
      </div>
    </div>
  )
}

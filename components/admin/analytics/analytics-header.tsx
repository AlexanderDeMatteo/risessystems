'use client'

import { useTranslations } from 'next-intl'

export function AnalyticsHeader() {
  const t = useTranslations('admin')

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">{t('analyticsTitle')}</h1>
      <p className="text-muted-foreground mt-1">{t('analyticsSubtitle')}</p>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common')
  const tAccounting = useTranslations('accounting')
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Alert variant="destructive" className="border-destructive/50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('error')}</AlertTitle>
        <AlertDescription>{error.message || tAccounting('errorOccurredLoadingPage')}</AlertDescription>
      </Alert>
      <Button variant="outline" className="mt-4" onClick={reset}>{t('tryAgain')}</Button>
    </div>
  );
}

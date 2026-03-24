import { getOwnerCompetitions } from '@/app/actions/competitions'
import { DashboardCompetitionsPageClient } from '@/components/dashboard/competitions/dashboard-competitions-page-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function DashboardCompetitionsPage() {
  const t = await getTranslations('errors')
  const { data, error } = await getOwnerCompetitions()

  return (
    <>
      {error && (
        <div className="px-6 lg:px-8 pt-6">
          <Alert variant="destructive" className="border-destructive/50 max-w-7xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <DashboardCompetitionsPageClient competitions={data} />
    </>
  )
}

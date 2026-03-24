import { getTranslations } from 'next-intl/server'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getAdminCompetitions, getAdminCompetitionKPIs } from '@/app/actions/admin-competitions'
import { AdminCompetitionsPageClient } from '@/components/admin/competitions/admin-competitions-page-client'

export default async function AdminCompetitionsPage() {
  const t = await getTranslations('admin')
  const [{ data, error }, kpisResult] = await Promise.all([
    getAdminCompetitions('all'),
    getAdminCompetitionKPIs(),
  ])
  const kpis =
    kpisResult.error == null
      ? { active: kpisResult.active, draft: kpisResult.draft, completed: kpisResult.completed }
      : null

  return (
    <main className="p-6 lg:p-8">
      {error && (
        <Alert variant="destructive" className="border-destructive/50 mb-6 max-w-7xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('couldNotLoadData')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <AdminCompetitionsPageClient competitions={data} kpis={kpis} />
    </main>
  )
}

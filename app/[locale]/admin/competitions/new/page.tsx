import { getTranslations } from 'next-intl/server'
import { getAdminClients } from '@/app/actions/admin'
import { AdminNewCompetitionForm } from '@/components/admin/competitions/admin-new-competition-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default async function AdminNewCompetitionPage() {
  const t = await getTranslations('admin')
  const { data: clients, error } = await getAdminClients()

  return (
    <main className="p-6 lg:p-8">
      {error && (
        <Alert variant="destructive" className="border-destructive/50 mb-6 max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('couldNotLoadData')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <AdminNewCompetitionForm clients={clients} />
    </main>
  )
}

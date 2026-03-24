import { getTranslations } from 'next-intl/server'
import { getPlatformPlans } from '@/app/actions/platform-plans'
import { getAdminClients } from '@/app/actions/admin'
import { AdminPlansPageClient } from './admin-plans-page-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default async function AdminPlansPage() {
  const t = await getTranslations('admin')
  const [plansResult, clientsResult] = await Promise.all([
    getPlatformPlans(),
    getAdminClients(),
  ])
  const initialTiers = plansResult.plans
  const clients = clientsResult.data
  const plansError = plansResult.error
  const clientsError = clientsResult.error
  const errorMessage = [plansError, clientsError].filter(Boolean).join('; ')

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {errorMessage && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('couldNotLoadData')}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <AdminPlansPageClient initialTiers={initialTiers} clients={clients} />
      </div>
    </main>
  )
}

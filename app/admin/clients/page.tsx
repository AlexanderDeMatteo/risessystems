import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getAdminClients, getPlatformPlans } from '@/app/actions/admin'
import { AdminClientsPageClient } from '@/components/admin/clients/admin-clients-page-client'

export default async function AdminClientsPage() {
  const [clientsResult, plansResult] = await Promise.all([
    getAdminClients(),
    getPlatformPlans(),
  ])
  const clients = clientsResult.data
  const plans = plansResult.data
  const errors = [clientsResult.error, plansResult.error].filter(Boolean) as string[]

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {errors.length > 0 && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Could not load data</AlertTitle>
            <AlertDescription>{errors.join('; ')}</AlertDescription>
          </Alert>
        )}
        <AdminClientsPageClient clients={clients} plans={plans} />
      </div>
    </main>
  )
}

import { ClientsHeader } from '@/components/admin/clients/clients-header'
import { ClientsTable } from '@/components/admin/clients/clients-table'

export default function ClientsPage() {
  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <ClientsHeader />
        <ClientsTable />
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import type { AdminClient, PlatformPlan } from '@/app/actions/admin'
import { ClientsHeader } from '@/components/admin/clients/clients-header'
import { ClientsTable } from '@/components/admin/clients/clients-table'
import { PendingActivationTable } from '@/components/admin/clients/pending-activation-table'
import { AddPlatformPaymentDialog, type PlatformClientOption } from '@/components/admin/accounting/add-platform-payment-dialog'
import { EditClientDialog } from '@/components/admin/clients/edit-client-dialog'

interface AdminClientsPageClientProps {
  clients: AdminClient[]
  plans: PlatformPlan[]
}

export function AdminClientsPageClient({ clients, plans }: AdminClientsPageClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null)
  const [editingClient, setEditingClient] = useState<AdminClient | null>(null)

  const inactiveClients = clients.filter((c) => c.status === 'inactive')
  const activeClients = clients.filter((c) => c.status !== 'inactive')

  const clientOptions: PlatformClientOption[] = clients.map((c) => ({
    id: c.id,
    name: c.name,
  }))

  const clientActiveUsers: Record<number, number> = {}
  for (const c of clients) {
    clientActiveUsers[c.id] = c.activeUsers
  }

  const handleChargeClient = (client: AdminClient) => {
    setSelectedClient(client)
    setIsDialogOpen(true)
  }

  const handleEditClient = (client: AdminClient) => {
    setEditingClient(client)
    setIsEditDialogOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedClient(null)
    setIsDialogOpen(open)
  }

  const handleEditOpenChange = (open: boolean) => {
    if (!open) setEditingClient(null)
    setIsEditDialogOpen(open)
  }

  return (
    <>
      <ClientsHeader />

      {inactiveClients.length > 0 && (
        <PendingActivationTable
          clients={inactiveClients}
          onActivate={handleChargeClient}
        />
      )}

      <ClientsTable
        clients={activeClients}
        plans={plans}
        onChargeClient={handleChargeClient}
        onEditClient={handleEditClient}
      />

      <AddPlatformPaymentDialog
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        clients={clientOptions}
        plans={plans}
        clientActiveUsers={clientActiveUsers}
        initialClientId={selectedClient?.id ?? null}
        subscriptionId={selectedClient?.subscriptionId ?? null}
        currentPeriodEnd={selectedClient?.subscriptionEndDate ?? null}
        initialPlanId={selectedClient?.planId ?? null}
      />

      <EditClientDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditOpenChange}
        client={editingClient}
      />
    </>
  )
}

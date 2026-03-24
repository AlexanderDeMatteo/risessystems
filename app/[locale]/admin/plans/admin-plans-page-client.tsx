'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { PlansHeader } from '@/components/admin/plans/plans-header'
import { PlansTiersTable } from '@/components/admin/plans/plans-tiers-table'
import { ClientsByPlan } from '@/components/admin/plans/clients-by-plan'
import { EditPlanTierDialog } from '@/components/admin/plans/edit-plan-tier-dialog'
import { createPlatformPlan, updatePlatformPlan, deletePlatformPlan, type CreatePlatformPlanInput } from '@/app/actions/platform-plans'
import type { AdminClient } from '@/app/actions/admin'
import type { PlatformPlan } from '@/lib/types/platform-plans'

interface AdminPlansPageClientProps {
  initialTiers: PlatformPlan[]
  clients: AdminClient[]
}

export function AdminPlansPageClient({ initialTiers, clients }: AdminPlansPageClientProps) {
  const router = useRouter()
  const [tiers, setTiers] = useState<PlatformPlan[]>(initialTiers)
  const [editTier, setEditTier] = useState<PlatformPlan | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTiers(initialTiers)
  }, [initialTiers])

  const refresh = useCallback(() => {
    router.refresh()
  }, [router])

  const handleTierAdded = useCallback(
    async (data: CreatePlatformPlanInput) => {
      setError(null)
      const result = await createPlatformPlan(data)
      if (result.ok) {
        refresh()
      } else {
        setError(result.error)
      }
    },
    [refresh]
  )

  const handleEdit = useCallback((tier: PlatformPlan) => {
    setEditTier(tier)
    setEditDialogOpen(true)
  }, [])

  const handleSave = useCallback(
    async (updated: PlatformPlan) => {
      setError(null)
      const result = await updatePlatformPlan(updated.id, {
        name: updated.name,
        min_active_users: updated.min_active_users,
        max_active_users: updated.max_active_users,
        price_monthly: updated.price_monthly,
        is_active: updated.is_active,
        sort_order: updated.sort_order,
        overage_threshold: updated.overage_threshold ?? null,
        overage_price_per_user: updated.overage_price_per_user ?? null,
      })
      if (result.ok) {
        setEditTier(null)
        setEditDialogOpen(false)
        refresh()
      } else {
        setError(result.error)
      }
    },
    [refresh]
  )

  const handleDelete = useCallback(
    async (tier: PlatformPlan) => {
      if (typeof window !== 'undefined' && !window.confirm(`Delete tier "${tier.name}"?`)) return
      setError(null)
      const result = await deletePlatformPlan(tier.id)
      if (result.ok) {
        if (editTier?.id === tier.id) {
          setEditTier(null)
          setEditDialogOpen(false)
        }
        refresh()
      } else {
        setError(result.error)
      }
    },
    [editTier, refresh]
  )

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <PlansHeader onTierAdded={handleTierAdded} currentTiers={tiers} />
        <PlansTiersTable tiers={tiers} onEdit={handleEdit} onDelete={handleDelete} />
        <ClientsByPlan tiers={tiers} clients={clients} />
        <EditPlanTierDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            if (!open) setEditTier(null)
            setEditDialogOpen(open)
          }}
          tier={editTier}
          onSave={handleSave}
        />
      </div>
    </main>
  )
}

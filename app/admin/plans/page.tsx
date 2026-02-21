'use client'

import { useState, useCallback } from 'react'
import { PlansHeader } from '@/components/admin/plans/plans-header'
import { PlansTiersTable } from '@/components/admin/plans/plans-tiers-table'
import { ClientsByPlan } from '@/components/admin/plans/clients-by-plan'
import { EditPlanTierDialog } from '@/components/admin/plans/edit-plan-tier-dialog'
import { getPlatformPlans } from '@/lib/mocks/platform-plans'
import type { PlatformPlan } from '@/lib/types/platform-plans'

export default function AdminPlansPage() {
  const [tiers, setTiers] = useState<PlatformPlan[]>(() => getPlatformPlans())
  const [editTier, setEditTier] = useState<PlatformPlan | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleTierAdded = useCallback((tier: PlatformPlan) => {
    setTiers(prev => [...prev, tier])
  }, [])

  const handleEdit = useCallback((tier: PlatformPlan) => {
    setEditTier(tier)
    setEditDialogOpen(true)
  }, [])

  const handleSave = useCallback((updated: PlatformPlan) => {
    setTiers(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
    )
    setEditTier(null)
  }, [])

  const handleDelete = useCallback((tier: PlatformPlan) => {
    setTiers(prev => prev.filter(t => t.id !== tier.id))
    if (editTier?.id === tier.id) {
      setEditTier(null)
      setEditDialogOpen(false)
    }
  }, [editTier])

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <PlansHeader
          onTierAdded={handleTierAdded}
          currentTiers={tiers}
        />
        <PlansTiersTable
          tiers={tiers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <ClientsByPlan tiers={tiers} />
        <EditPlanTierDialog
          open={editDialogOpen}
          onOpenChange={open => {
            setEditDialogOpen(open)
            if (!open) setEditTier(null)
          }}
          tier={editTier}
          onSave={handleSave}
        />
      </div>
    </main>
  )
}

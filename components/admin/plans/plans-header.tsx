'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AddPlanTierDialog } from './add-plan-tier-dialog'
import type { PlatformPlan } from '@/lib/types/platform-plans'

interface PlansHeaderProps {
  onTierAdded: (tier: PlatformPlan) => void
  currentTiers: PlatformPlan[]
}

export function PlansHeader({ onTierAdded, currentTiers }: PlansHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plans & Pricing</h1>
          <p className="text-muted-foreground mt-1">
            Define platform tiers by active user range and monthly price
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add tier
        </Button>
      </div>
      <AddPlanTierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdded={onTierAdded}
        currentTiers={currentTiers}
      />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlansHeader } from '@/components/plans/plans-header'
import { PlansTable, type MembershipPlan } from '@/components/plans/plans-table'
import { AddPlanDialog, type AddPlanFormData } from '@/components/plans/add-plan-dialog'
import { EditPlanDialog } from '@/components/plans/edit-plan-dialog'
import { DeletePlanDialog } from '@/components/plans/delete-plan-dialog'
import { Card } from '@/components/ui/card'
import { createPlan, updatePlan, deletePlan } from '@/app/actions/plans'

interface PlansPageClientProps {
  initialPlans: MembershipPlan[]
}

export function PlansPageClient({ initialPlans }: PlansPageClientProps) {
  const router = useRouter()
  const [plans, setPlans] = useState<MembershipPlan[]>(initialPlans)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null)
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setPlans(initialPlans)
  }, [initialPlans])

  const handleEditClick = (plan: MembershipPlan) => {
    setSelectedPlan(plan)
    setIsEditDialogOpen(true)
  }

  const handleSavePlan = async (updatedPlan: MembershipPlan) => {
    const result = await updatePlan(updatedPlan.id, {
      name: updatedPlan.name,
      description: updatedPlan.description ?? undefined,
      price: updatedPlan.price,
      duration_days: updatedPlan.duration_days,
    })
    if (result.ok) {
      setIsEditDialogOpen(false)
      router.refresh()
    }
  }

  const handleDeleteClick = (plan: MembershipPlan) => {
    setPlanToDelete(plan)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async (plan: MembershipPlan) => {
    const result = await deletePlan(plan.id)
    if (result.ok) {
      setIsDeleteDialogOpen(false)
      setPlanToDelete(null)
      router.refresh()
    }
  }

  const handleAddPlan = async (data: AddPlanFormData) => {
    const result = await createPlan({
      name: data.name,
      description: data.description || undefined,
      price: data.price,
      duration_days: data.duration_days,
    })
    if (result.ok) {
      setIsAddDialogOpen(false)
      router.refresh()
    }
  }

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Plans</h1>
            <p className="text-muted-foreground mt-1">Manage membership plans and pricing</p>
          </div>
        </div>
        <PlansHeader
          onAddClick={() => setIsAddDialogOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <Card className="bg-card border-border">
          <PlansTable
            searchTerm={searchTerm}
            plans={plans}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </Card>
        <AddPlanDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onPlanAdded={handleAddPlan} />
        <EditPlanDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          plan={selectedPlan}
          onSave={handleSavePlan}
        />
        <DeletePlanDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          plan={planToDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </main>
  )
}

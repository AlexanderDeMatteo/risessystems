'use client'

import { useState } from 'react'
import { PlansHeader } from '@/components/plans/plans-header'
import { PlansTable, MOCK_PLANS, type MembershipPlan } from '@/components/plans/plans-table'
import { AddPlanDialog, type AddPlanFormData } from '@/components/plans/add-plan-dialog'
import { EditPlanDialog } from '@/components/plans/edit-plan-dialog'
import { DeletePlanDialog } from '@/components/plans/delete-plan-dialog'
import { Card } from '@/components/ui/card'

export default function PlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>(MOCK_PLANS)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null)
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleEditClick = (plan: MembershipPlan) => {
    setSelectedPlan(plan)
    setIsEditDialogOpen(true)
  }

  const handleSavePlan = (updatedPlan: MembershipPlan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    )
  }

  const handleDeleteClick = (plan: MembershipPlan) => {
    setPlanToDelete(plan)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = (plan: MembershipPlan) => {
    setPlans((prev) => prev.filter((p) => p.id !== plan.id))
  }

  const handleAddPlan = (data: AddPlanFormData) => {
    const newId = plans.length > 0 ? Math.max(...plans.map((p) => p.id)) + 1 : 1
    const newPlan: MembershipPlan = {
      id: newId,
      name: data.name,
      description: data.description || null,
      price: data.price,
      duration_days: data.duration_days,
      is_active: true,
    }
    setPlans((prev) => [...prev, newPlan])
  }

  return (
    <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Plans</h1>
              <p className="text-muted-foreground mt-1">
                Manage membership plans and pricing
              </p>
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

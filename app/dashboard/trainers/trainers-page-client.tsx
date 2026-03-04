'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrainersHeader } from '@/components/trainers/trainers-header'
import { TrainersTable } from '@/components/trainers/trainers-table'
import { AddTrainerDialog } from '@/components/trainers/add-trainer-dialog'
import { PrimaryTrainerCard } from '@/components/trainers/primary-trainer-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { Trainer } from '@/components/trainers/edit-trainer-dialog'
import type { TrainerFormData } from '@/components/trainers/trainer-form'
import { createTrainer, updateTrainer, deleteTrainer } from '@/app/actions/trainers'

interface BranchOption {
  id: string
  name: string
}

interface TrainersPageClientProps {
  initialTrainers: Trainer[]
  branchOptions: BranchOption[]
  trainersError?: string
  branchesError?: string
}

export function TrainersPageClient({ initialTrainers, branchOptions, trainersError, branchesError }: TrainersPageClientProps) {
  const router = useRouter()
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [primaryTrainerByBranch, setPrimaryTrainerByBranch] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    initialTrainers.forEach((t) => {
      if (t.isPrimary && t.branch) {
        initial[t.branch] = t.id
      }
    })
    return initial
  })

  useEffect(() => {
    setTrainers(initialTrainers)
  }, [initialTrainers])

  const handleSetPrimary = useCallback((branch: string, trainerId: number) => {
    setPrimaryTrainerByBranch((prev) => ({ ...prev, [branch]: trainerId }))
    const t = trainers.find((x) => x.id === trainerId)
    if (t?.branch) {
      updateTrainer(trainerId, { is_primary: true }).then(() => router.refresh())
    }
  }, [trainers, router])

  const handleClearPrimaryForBranch = useCallback((branch: string) => {
    setPrimaryTrainerByBranch((prev) => {
      const next = { ...prev }
      delete next[branch]
      return next
    })
    router.refresh()
  }, [router])

  const handleTrainerAdded = useCallback(async (data: TrainerFormData) => {
    const result = await createTrainer({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      specialties: data.specialties || undefined,
      branch_id: data.branchId ? parseInt(data.branchId, 10) : undefined,
      is_primary: data.isPrimaryForBranch ?? false,
      hire_date: data.hireDate || undefined,
    })
    if (result.ok) {
      setIsDialogOpen(false)
      router.refresh()
    }
  }, [router])

  const handleTrainersChange = useCallback((newTrainers: Trainer[]) => {
    setTrainers(newTrainers)
  }, [])

  const handleSaveEdit = useCallback(async (updatedTrainer: Trainer) => {
    const branchId = updatedTrainer.branch ? branchOptions.find((b) => b.name === updatedTrainer.branch)?.id : undefined
    const result = await updateTrainer(updatedTrainer.id, {
      name: updatedTrainer.name,
      email: updatedTrainer.email,
      phone: updatedTrainer.phone || undefined,
      specialties: updatedTrainer.specialties || undefined,
      branch_id: branchId ? parseInt(branchId, 10) : undefined,
      is_primary: updatedTrainer.isPrimary,
      hire_date: updatedTrainer.hireDate || undefined,
    })
    if (result.ok) router.refresh()
  }, [branchOptions, router])

  const handleConfirmDelete = useCallback(async (trainer: Trainer) => {
    const result = await deleteTrainer(trainer.id)
    if (result.ok) router.refresh()
  }, [router])

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {trainersError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Could not load trainers</AlertTitle>
            <AlertDescription>{trainersError}</AlertDescription>
          </Alert>
        )}
        {branchesError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Could not load branches</AlertTitle>
            <AlertDescription>{branchesError}</AlertDescription>
          </Alert>
        )}
        <TrainersHeader
          onAddClick={() => setIsDialogOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrainersTable
              trainers={trainers}
              onTrainersChange={handleTrainersChange}
              primaryTrainerByBranch={primaryTrainerByBranch}
              onSetPrimary={handleSetPrimary}
              onClearPrimaryForBranch={handleClearPrimaryForBranch}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              onSaveTrainer={handleSaveEdit}
              onDeleteTrainer={handleConfirmDelete}
              branchOptions={branchOptions}
            />
          </div>
          <div>
            <PrimaryTrainerCard
              trainers={trainers}
              primaryTrainerByBranch={primaryTrainerByBranch}
              branchOptions={branchOptions}
            />
          </div>
        </div>
        <AddTrainerDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onTrainerAdded={handleTrainerAdded}
          branchOptions={branchOptions}
        />
      </div>
    </main>
  )
}

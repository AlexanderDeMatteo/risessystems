'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TrainerForm, MOCK_BRANCHES, type TrainerFormData } from './trainer-form'

export interface Trainer {
  id: number
  name: string
  email: string
  phone: string
  branch: string
  specialties: string
  status: 'active' | 'inactive'
  isPrimary?: boolean
  hireDate?: string
  notes?: string
}

export type PrimaryTrainerByBranch = Record<string, number>

interface EditTrainerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trainer: Trainer | null
  primaryTrainerByBranch?: PrimaryTrainerByBranch
  onSave?: (updatedTrainer: Trainer) => void
  onSetPrimary?: (branch: string, trainerId: number) => void
  onClearPrimaryForBranch?: (branch: string) => void
}

function getBranchIdFromName(branchName: string): string {
  const branch = MOCK_BRANCHES.find((b) => b.name === branchName)
  return branch?.id ?? ''
}

export function EditTrainerDialog({
  open,
  onOpenChange,
  trainer,
  primaryTrainerByBranch = {},
  onSave,
  onSetPrimary,
  onClearPrimaryForBranch,
}: EditTrainerDialogProps) {
  const initialData: Partial<TrainerFormData> | undefined = trainer
    ? {
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        branchId: getBranchIdFromName(trainer.branch),
        specialties: trainer.specialties,
        status: trainer.status,
        hireDate: trainer.hireDate ?? '',
        notes: trainer.notes ?? '',
        isPrimaryForBranch: primaryTrainerByBranch[trainer.branch] === trainer.id,
      }
    : undefined

  const handleSubmit = (data: TrainerFormData) => {
    if (!trainer) return

    const branchName =
      MOCK_BRANCHES.find((b) => b.id === data.branchId)?.name ?? trainer.branch

    const updatedTrainer = {
      ...trainer,
      name: data.name,
      email: data.email,
      phone: data.phone,
      branch: branchName,
      specialties: data.specialties,
      status: data.status,
    }

    onSave?.(updatedTrainer)

    if (primaryTrainerByBranch[trainer.branch] === trainer.id && trainer.branch !== branchName) {
      onClearPrimaryForBranch?.(trainer.branch)
    }
    if (data.isPrimaryForBranch) {
      onSetPrimary?.(branchName, trainer.id)
    } else if (primaryTrainerByBranch[branchName] === trainer.id) {
      onClearPrimaryForBranch?.(branchName)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Edit Trainer{trainer ? ` — ${trainer.name}` : ''}
          </DialogTitle>
        </DialogHeader>

        {trainer && (
          <TrainerForm
            key={trainer.id}
            formKey={trainer.id}
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            submitLabel="Save Changes"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

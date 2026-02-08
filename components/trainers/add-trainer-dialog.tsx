'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TrainerForm, type TrainerFormData } from './trainer-form'

interface AddTrainerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTrainerDialog({ open, onOpenChange }: AddTrainerDialogProps) {
  const handleSubmit = (data: TrainerFormData) => {
    // Demo: just close the dialog (replace with API call when ready)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Trainer</DialogTitle>
        </DialogHeader>

        <TrainerForm
          formKey={open ? 'add' : 'add-closed'}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Add Trainer"
        />
      </DialogContent>
    </Dialog>
  )
}

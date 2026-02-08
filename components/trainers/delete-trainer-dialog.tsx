'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Trainer } from './edit-trainer-dialog'

interface DeleteTrainerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trainer: Trainer | null
  onConfirm: (trainer: Trainer) => void
}

export function DeleteTrainerDialog({
  open,
  onOpenChange,
  trainer,
  onConfirm,
}: DeleteTrainerDialogProps) {
  const handleConfirm = () => {
    if (trainer) {
      onConfirm(trainer)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Delete Trainer
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">{trainer?.name}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

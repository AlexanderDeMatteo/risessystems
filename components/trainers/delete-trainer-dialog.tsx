'use client'

import { useTranslations } from 'next-intl'
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
  const t = useTranslations('trainers')
  const tCommon = useTranslations('common')

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
            {t('deleteTrainer')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteConfirmText')}{' '}
            <span className="font-semibold text-foreground">{trainer?.name}</span>?
            {' '}{t('deleteWarning')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {tCommon('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

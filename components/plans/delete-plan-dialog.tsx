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
import type { MembershipPlan } from '@/lib/types/plans'

interface DeletePlanDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  plan: MembershipPlan | null
  onConfirm: (plan: MembershipPlan) => void
}

export function DeletePlanDialog({
  isOpen,
  onOpenChange,
  plan,
  onConfirm,
}: DeletePlanDialogProps) {
  const t = useTranslations('plans')
  const tCommon = useTranslations('common')

  const handleConfirm = () => {
    if (plan) {
      onConfirm(plan)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            {t('deletePlan')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteConfirmText')}{' '}
            <span className="font-semibold text-foreground">{plan?.name}</span>?
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

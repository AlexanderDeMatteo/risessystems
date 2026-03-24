'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, Trash2, Star } from 'lucide-react'
import { EditTrainerDialog, type Trainer, type PrimaryTrainerByBranch } from './edit-trainer-dialog'
import { DeleteTrainerDialog } from './delete-trainer-dialog'

interface TrainersTableProps {
  trainers: Trainer[]
  onTrainersChange: (trainers: Trainer[]) => void
  primaryTrainerByBranch: PrimaryTrainerByBranch
  onSetPrimary: (branch: string, trainerId: number) => void
  onClearPrimaryForBranch: (branch: string) => void
  searchTerm: string
  filterStatus: string
  onSaveTrainer?: (trainer: Trainer) => void | Promise<void>
  onDeleteTrainer?: (trainer: Trainer) => void | Promise<void>
  branchOptions?: { id: string; name: string }[]
}

export function TrainersTable({
  trainers,
  onTrainersChange,
  primaryTrainerByBranch,
  onSetPrimary,
  onClearPrimaryForBranch,
  searchTerm,
  filterStatus,
  onSaveTrainer,
  onDeleteTrainer,
  branchOptions,
}: TrainersTableProps) {
  const t = useTranslations('trainers')
  const tCommon = useTranslations('common')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [trainerToEdit, setTrainerToEdit] = useState<Trainer | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [trainerToDelete, setTrainerToDelete] = useState<Trainer | null>(null)

  const handleEditClick = (trainer: Trainer) => {
    setTrainerToEdit(trainer)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async (updatedTrainer: Trainer) => {
    await onSaveTrainer?.(updatedTrainer)
    onTrainersChange(
      trainers.map((t) => (t.id === updatedTrainer.id ? { ...t, ...updatedTrainer } : t))
    )
  }

  const handleDeleteClick = (trainer: Trainer) => {
    setTrainerToDelete(trainer)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async (trainer: Trainer) => {
    await onDeleteTrainer?.(trainer)
    onTrainersChange(trainers.filter((t) => t.id !== trainer.id))
    if (primaryTrainerByBranch[trainer.branch] === trainer.id) {
      onClearPrimaryForBranch(trainer.branch)
    }
  }

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || trainer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <Card className="bg-card border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-8"></TableHead>
              <TableHead>{tCommon('name')}</TableHead>
              <TableHead>{tCommon('email')}</TableHead>
              <TableHead>{tCommon('phone')}</TableHead>
              <TableHead>{t('branch')}</TableHead>
              <TableHead>{t('specialties')}</TableHead>
              <TableHead>{tCommon('status')}</TableHead>
              <TableHead className="text-right">{tCommon('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => (
                <TableRow key={trainer.id} className="border-border hover:bg-secondary/50">
                  <TableCell>
                    <div
                      className={`inline-flex p-1 ${primaryTrainerByBranch[trainer.branch] === trainer.id ? 'text-yellow-500' : 'text-muted-foreground'}`}
                      title={primaryTrainerByBranch[trainer.branch] === trainer.id ? t('primaryTrainerForBranch') : undefined}
                    >
                      <Star
                        className="w-4 h-4"
                        fill={primaryTrainerByBranch[trainer.branch] === trainer.id ? 'currentColor' : 'none'}
                        aria-hidden
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{trainer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{trainer.email}</TableCell>
                  <TableCell className="text-muted-foreground">{trainer.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{trainer.branch}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{trainer.specialties}</TableCell>
                  <TableCell>
                    {trainer.status === 'active' ? (
                      <Badge className="bg-green-900 text-green-100">{tCommon('active')}</Badge>
                    ) : (
                      <Badge className="bg-gray-700 text-gray-100">{tCommon('inactive')}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-secondary"
                        onClick={() => handleEditClick(trainer)}
                        aria-label={t('editTrainer')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-destructive/20 text-destructive"
                        onClick={() => handleDeleteClick(trainer)}
                        aria-label={t('deleteTrainer')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {t('noTrainers')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditTrainerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        trainer={trainerToEdit}
        primaryTrainerByBranch={primaryTrainerByBranch}
        onSave={handleSaveEdit}
        onSetPrimary={onSetPrimary}
        onClearPrimaryForBranch={onClearPrimaryForBranch}
        branchOptions={branchOptions}
      />

      <DeleteTrainerDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        trainer={trainerToDelete}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}

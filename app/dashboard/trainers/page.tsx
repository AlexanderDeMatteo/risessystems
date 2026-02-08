'use client'

import { useState, useCallback } from 'react'
import { TrainersHeader } from '@/components/trainers/trainers-header'
import { TrainersTable } from '@/components/trainers/trainers-table'
import { AddTrainerDialog } from '@/components/trainers/add-trainer-dialog'
import { PrimaryTrainerCard } from '@/components/trainers/primary-trainer-card'
import type { Trainer } from '@/components/trainers/edit-trainer-dialog'

const initialTrainers: Trainer[] = [
  { id: 1, name: 'Carlos Martinez', email: 'carlos@gym.com', phone: '555-0001', specialties: 'CrossFit, Strength', branch: 'Downtown Branch', status: 'active', isPrimary: true },
  { id: 2, name: 'Ana Rodriguez', email: 'ana@gym.com', phone: '555-0002', specialties: 'Yoga, Pilates', branch: 'Westside Branch', status: 'active', isPrimary: false },
  { id: 3, name: 'Jorge Silva', email: 'jorge@gym.com', phone: '555-0003', specialties: 'Boxing, Cardio', branch: 'Downtown Branch', status: 'active', isPrimary: false },
  { id: 4, name: 'Laura Gomez', email: 'laura@gym.com', phone: '555-0004', specialties: 'Personal Training', branch: 'North Branch', status: 'inactive', isPrimary: false },
  { id: 5, name: 'Miguel Ruiz', email: 'miguel@gym.com', phone: '555-0005', specialties: 'Nutrition, Training', branch: 'Airport Branch', status: 'active', isPrimary: false },
]

export default function TrainersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers)
  const [primaryTrainerByBranch, setPrimaryTrainerByBranch] = useState<Record<string, number>>({
    'Downtown Branch': 1,
  })

  const handleSetPrimary = useCallback((branch: string, trainerId: number) => {
    setPrimaryTrainerByBranch((prev) => ({
      ...prev,
      [branch]: trainerId,
    }))
  }, [])

  const handleClearPrimaryForBranch = useCallback((branch: string) => {
    setPrimaryTrainerByBranch((prev) => {
      const next = { ...prev }
      delete next[branch]
      return next
    })
  }, [])

  return (
    <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
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
                onTrainersChange={setTrainers}
                primaryTrainerByBranch={primaryTrainerByBranch}
                onSetPrimary={handleSetPrimary}
                onClearPrimaryForBranch={handleClearPrimaryForBranch}
                searchTerm={searchTerm}
                filterStatus={filterStatus}
              />
            </div>
            <div>
              <PrimaryTrainerCard
                trainers={trainers}
                primaryTrainerByBranch={primaryTrainerByBranch}
              />
            </div>
          </div>

          <AddTrainerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    </main>
  )
}

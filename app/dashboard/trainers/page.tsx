'use client'

import { useState } from 'react'
import { TrainersHeader } from '@/components/trainers/trainers-header'
import { TrainersTable } from '@/components/trainers/trainers-table'
import { AddTrainerDialog } from '@/components/trainers/add-trainer-dialog'
import { PrimaryTrainerCard } from '@/components/trainers/primary-trainer-card'

export default function TrainersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <TrainersHeader 
        onAddClick={() => setIsDialogOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrainersTable searchTerm={searchTerm} filterStatus={filterStatus} />
        </div>
        <div>
          <PrimaryTrainerCard />
        </div>
      </div>

      <AddTrainerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

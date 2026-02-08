'use client'

import { useState } from 'react'
import { BranchesHeader } from '@/components/branches/branches-header'
import { BranchesGrid } from '@/components/branches/branches-grid'
import { AddBranchDialog } from '@/components/branches/add-branch-dialog'

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <BranchesHeader 
            onAddClick={() => setIsDialogOpen(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <BranchesGrid searchTerm={searchTerm} />

          <AddBranchDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import { BranchesHeader } from '@/components/branches/branches-header'
import { BranchesGrid } from '@/components/branches/branches-grid'
import { AddBranchDialog } from '@/components/branches/add-branch-dialog'

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <BranchesHeader 
        onAddClick={() => setIsDialogOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <BranchesGrid searchTerm={searchTerm} />

      <AddBranchDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

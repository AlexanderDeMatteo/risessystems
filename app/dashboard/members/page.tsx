'use client'

import { useState } from 'react'
import { MembersTable } from '@/components/members/members-table'
import { MembersHeader } from '@/components/members/members-header'
import { AddMemberDialog } from '@/components/members/add-member-dialog'
import { Card } from '@/components/ui/card'

export default function MembersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  return (
    <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Members</h1>
              <p className="text-muted-foreground mt-1">Manage your gym members</p>
            </div>
          </div>

          {/* Search and filters */}
          <MembersHeader
            onAddClick={() => setIsAddDialogOpen(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />

          {/* Members table */}
          <Card className="bg-card border-border">
            <MembersTable
              searchTerm={searchTerm}
              filterStatus={filterStatus}
            />
          </Card>

          {/* Add member dialog */}
          <AddMemberDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
          />
        </div>
    </main>
  )
}

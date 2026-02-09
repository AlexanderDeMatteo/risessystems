'use client'

import { useState, useCallback } from 'react'
import { MembersTable, type Member } from '@/components/members/members-table'
import { MembersHeader } from '@/components/members/members-header'
import { AddMemberDialog, type AddMemberFormData } from '@/components/members/add-member-dialog'
import { Card } from '@/components/ui/card'
import { getInitialMembers } from '@/lib/initial-members'

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function MembersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [members, setMembers] = useState<Member[]>(() => getInitialMembers())

  const handleMemberAdded = useCallback((data: AddMemberFormData) => {
    setMembers((prev) => {
      const nextId = Math.max(0, ...prev.map((m) => m.id)) + 1
      const joinDate = new Date().toISOString().slice(0, 10)
      const durationDays = data.membershipType === 'premium' ? 365 : data.membershipType === 'standard' ? 90 : 30
      const expiryDate = addDays(joinDate, durationDays)
      const newMember: Member = {
        id: nextId,
        name: [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || 'Unknown',
        email: data.email,
        phone: data.phone || '',
        membership_type: data.membershipType,
        status: 'active',
        join_date: joinDate,
        expiry_date: expiryDate,
      }
      return [...prev, newMember]
    })
  }, [])

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
              members={members}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
            />
          </Card>

          {/* Add member dialog */}
          <AddMemberDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onMemberAdded={handleMemberAdded}
          />
        </div>
    </main>
  )
}

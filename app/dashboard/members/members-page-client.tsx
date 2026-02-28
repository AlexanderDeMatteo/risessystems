'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MembersTable, type Member } from '@/components/members/members-table'
import { MembersHeader } from '@/components/members/members-header'
import { AddMemberDialog, type AddMemberFormData } from '@/components/members/add-member-dialog'
import { Card } from '@/components/ui/card'
import { createMember } from '@/app/actions/members'
import type { MemberRow } from '@/app/actions/members'

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function toMember(r: MemberRow): Member {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? '',
    membership_type: r.membership_type,
    status: r.status,
    join_date: r.join_date,
    expiry_date: r.expiry_date,
  }
}

interface MembersPageClientProps {
  initialMembers: MemberRow[]
}

export function MembersPageClient({ initialMembers }: MembersPageClientProps) {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>(() => initialMembers.map(toMember))
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    setMembers(initialMembers.map(toMember))
  }, [initialMembers])

  const handleMemberAdded = useCallback(async (data: AddMemberFormData) => {
    const joinDate = new Date().toISOString().slice(0, 10)
    const durationDays = data.membershipType === 'premium' ? 365 : data.membershipType === 'standard' ? 90 : 30
    const expiryDate = addDays(joinDate, durationDays)
    const result = await createMember({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email || undefined,
      phone: data.phone || undefined,
      membership_type: data.membershipType,
      join_date: joinDate,
      expiry_date: expiryDate,
    })
    if (result.ok) {
      setIsAddDialogOpen(false)
      router.refresh()
    }
  }, [router])

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Members</h1>
            <p className="text-muted-foreground mt-1">Manage your gym members</p>
          </div>
        </div>
        <MembersHeader
          onAddClick={() => setIsAddDialogOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
        <Card className="bg-card border-border">
          <MembersTable
            members={members}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
          />
        </Card>
        <AddMemberDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onMemberAdded={handleMemberAdded}
        />
      </div>
    </main>
  )
}

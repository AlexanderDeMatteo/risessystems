'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MembersTable, type Member } from '@/components/members/members-table'
import { MembersHeader } from '@/components/members/members-header'
import { AddMemberDialog, type AddMemberFormData } from '@/components/members/add-member-dialog'
import { EditMemberDialog } from '@/components/members/edit-member-dialog'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { createMember, updateMember } from '@/app/actions/members'
import type { MemberRow } from '@/app/actions/members'
import type { PlanRow } from '@/app/actions/plans'

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
  membersError?: string
  initialPlans: PlanRow[]
}

export function MembersPageClient({ initialMembers, membersError, initialPlans }: MembersPageClientProps) {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>(() => initialMembers.map(toMember))
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    setMembers(initialMembers.map(toMember))
  }, [initialMembers])

  const handleMemberAdded = useCallback(async (data: AddMemberFormData) => {
    const plan = initialPlans.find((p) => p.id === data.planId)
    if (!plan) return

    const joinDate = new Date().toISOString().slice(0, 10)
    const expiryDate = addDays(joinDate, plan.duration_days)

    const result = await createMember({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email || undefined,
      phone: data.phone || undefined,
      membership_type: plan.name,
      join_date: joinDate,
      expiry_date: expiryDate,
    })
    if (result.ok) {
      setIsAddDialogOpen(false)
      router.refresh()
    }
  }, [router, initialPlans])

  const handleMemberUpdated = useCallback(
    async (id: number, updates: { first_name?: string; last_name?: string; email?: string; phone?: string; status?: string }) => {
      const result = await updateMember(id, updates)
      if (result.ok) {
        setEditingMember(null)
        router.refresh()
      }
    },
    [router]
  )

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {membersError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Could not load members</AlertTitle>
            <AlertDescription>{membersError}</AlertDescription>
          </Alert>
        )}
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
            onEdit={(m) => setEditingMember(m)}
          />
        </Card>
        <AddMemberDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onMemberAdded={handleMemberAdded}
          plans={initialPlans.filter((p) => p.is_active)}
        />
        <EditMemberDialog
          isOpen={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          member={editingMember}
          onSave={handleMemberUpdated}
        />
      </div>
    </main>
  )
}

'use client'

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
import { Edit, Trash2 } from 'lucide-react'

export interface Member {
  id: number
  name: string
  email: string
  phone: string
  membership_type: string
  status: string
  /** ISO date YYYY-MM-DD */
  join_date?: string
  /** ISO date YYYY-MM-DD */
  expiry_date?: string
}

/** Days until expiry; negative if already expired */
export function getDaysRemaining(expiryDate?: string): number | null {
  if (!expiryDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export type RenewalPrediction = 'likely' | 'uncertain' | 'at_risk'

/** Simple rules-based renewal prediction */
export function getRenewalPrediction(member: Member): RenewalPrediction {
  const days = getDaysRemaining(member.expiry_date)
  if (days === null) return 'uncertain'
  if (days < 0) return 'at_risk'
  if (member.status === 'inactive') return 'at_risk'
  if (days <= 7) return 'uncertain'
  return 'likely'
}

interface MembersTableProps {
  members: Member[]
  searchTerm: string
  filterStatus: string
}

export function MembersTable({ members, searchTerm, filterStatus }: MembersTableProps) {
  const filteredMembers = members.filter((member: Member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' || member.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-900 text-green-100">Active</Badge>
      case 'suspended':
        return <Badge className="bg-yellow-900 text-yellow-100">Suspended</Badge>
      case 'inactive':
        return <Badge className="bg-red-900 text-red-100">Inactive</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getMembershipBadge = (type: string) => {
    switch (type) {
      case 'premium':
        return <Badge className="bg-primary/30 text-primary border border-primary/50">Premium</Badge>
      case 'standard':
        return <Badge className="bg-success/20 text-success border border-success/50">Standard</Badge>
      case 'basic':
        return <Badge className="bg-muted/50 text-muted-foreground border border-border">Basic</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatDaysRemaining = (expiryDate?: string) => {
    const days = getDaysRemaining(expiryDate)
    if (days === null) return '—'
    if (days < 0) return <span className="text-destructive font-medium">Expired {Math.abs(days)}d ago</span>
    if (days === 0) return <span className="text-amber-500 font-medium">Today</span>
    if (days <= 7) return <span className="text-amber-500 font-medium">{days} days</span>
    return <span className="text-muted-foreground">{days} days</span>
  }

  const getRenewalBadge = (member: Member) => {
    const pred = getRenewalPrediction(member)
    switch (pred) {
      case 'likely':
        return <Badge className="bg-green-900/80 text-green-100 border-green-600/50">Likely to renew</Badge>
      case 'uncertain':
        return <Badge className="bg-amber-900/80 text-amber-100 border-amber-600/50">Uncertain</Badge>
      case 'at_risk':
        return <Badge className="bg-red-900/80 text-red-100 border-red-600/50">At risk</Badge>
      default:
        return null
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader className="bg-secondary/30 border-border">
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Name</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Email</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Phone</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Membership</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Status</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Days left</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Renewal</TableHead>
            <TableHead className="text-right uppercase text-xs tracking-wider text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member: Member) => (
              <TableRow key={member.id} className="border-border/50 hover:bg-secondary/30 transition-colors duration-200">
                <TableCell className="font-medium font-mono">{member.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">{member.email}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">{member.phone || '-'}</TableCell>
                <TableCell>{getMembershipBadge(member.membership_type)}</TableCell>
                <TableCell>{getStatusBadge(member.status)}</TableCell>
                <TableCell>{formatDaysRemaining(member.expiry_date)}</TableCell>
                <TableCell>{getRenewalBadge(member)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="hover:bg-secondary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-destructive/20 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

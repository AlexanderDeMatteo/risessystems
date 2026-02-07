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

interface MembersTableProps {
  searchTerm: string
  filterStatus: string
}

// Mock members data
const mockMembers = [
  { id: 1, name: 'John Smith', email: 'john@example.com', phone: '555-0001', membership_type: 'premium', status: 'active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0002', membership_type: 'standard', status: 'active' },
  { id: 3, name: 'Mike Davis', email: 'mike@example.com', phone: '555-0003', membership_type: 'basic', status: 'suspended' },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', phone: '555-0004', membership_type: 'premium', status: 'active' },
  { id: 5, name: 'David Brown', email: 'david@example.com', phone: '555-0005', membership_type: 'standard', status: 'inactive' },
]

export function MembersTable({ searchTerm, filterStatus }: MembersTableProps) {
  const filteredMembers = mockMembers.filter((member: any) => {
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
            <TableHead className="text-right uppercase text-xs tracking-wider text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member: any) => (
              <TableRow key={member.id} className="border-border/50 hover:bg-secondary/30 transition-colors duration-200">
                <TableCell className="font-medium font-mono">{member.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">{member.email}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">{member.phone || '-'}</TableCell>
                <TableCell>{getMembershipBadge(member.membership_type)}</TableCell>
                <TableCell>{getStatusBadge(member.status)}</TableCell>
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
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

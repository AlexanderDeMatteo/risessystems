'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Zap } from 'lucide-react'
import type { Member } from '@/components/members/members-table'

function getPlanBadge(type: string) {
  switch (type) {
    case 'premium':
      return <Badge className="bg-primary/30 text-primary border border-primary/50">Premium</Badge>
    case 'standard':
      return <Badge className="bg-success/20 text-success border border-success/50">Standard</Badge>
    case 'basic':
      return <Badge className="bg-muted/50 text-muted-foreground border border-border">Basic</Badge>
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}

function formatJoinDate(joinDate?: string): string {
  if (!joinDate) return '—'
  const d = new Date(joinDate + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface PendingActivationTableProps {
  members: Member[]
  onActivate: (member: Member) => void
}

export function PendingActivationTable({ members, onActivate }: PendingActivationTableProps) {
  return (
    <Card className="bg-card border-border">
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-foreground">
          Pending activation
          <span className="ml-2 font-normal text-muted-foreground">({members.length})</span>
        </h3>

        <div className="overflow-x-auto rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">
                  Email
                </TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">
                  Plan
                </TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">
                  Joined
                </TableHead>
                <TableHead className="text-right uppercase text-xs tracking-wider text-muted-foreground">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 ? (
                members.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-border hover:bg-secondary/30"
                  >
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {member.email ?? '—'}
                    </TableCell>
                    <TableCell>{getPlanBadge(member.membership_type)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatJoinDate(member.join_date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-amber-500/20 text-amber-600 border border-amber-500/50 mb-2 mr-2">
                        Awaiting payment
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => onActivate(member)}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Activate & Pay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No members pending activation
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}

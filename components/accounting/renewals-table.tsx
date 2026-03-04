'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, CreditCard } from 'lucide-react'
import type { Member } from '@/components/members/members-table'
import { getDaysRemaining } from '@/components/members/members-table'
import { cn } from '@/lib/utils'

export type RenewalFilter = 'expired' | '7' | '14' | '30'

function formatDaysLeft(expiryDate?: string): { text: string; className: string } {
  const days = getDaysRemaining(expiryDate)
  if (days === null) return { text: '—', className: 'text-muted-foreground' }
  if (days < 0) return { text: `Expired ${Math.abs(days)}d ago`, className: 'text-destructive font-medium' }
  if (days === 0) return { text: 'Today', className: 'text-amber-500 font-medium' }
  if (days <= 7) return { text: `${days} days`, className: 'text-amber-500 font-medium' }
  return { text: `${days} days`, className: 'text-muted-foreground' }
}

function getRowUrgencyClass(days: number | null): string {
  if (days === null) return ''
  if (days < 0) return 'bg-destructive/10'
  if (days <= 7) return 'bg-amber-500/10'
  return ''
}

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

interface RenewalsTableProps {
  members: Member[]
  defaultFilter?: RenewalFilter
  onRecordPayment: (member: Member) => void
}

export function RenewalsTable({ members, defaultFilter = '30', onRecordPayment }: RenewalsTableProps) {
  const [filter, setFilter] = useState<RenewalFilter>(defaultFilter)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setSearchTerm('')
  }, [filter])

  const filteredByExpiry = members.filter((m) => {
    const days = getDaysRemaining(m.expiry_date)
    if (days === null) return false
    const maxDays = filter === 'expired' ? 0 : parseInt(filter, 10)
    return days <= maxDays
  })

  const filteredBySearch = filteredByExpiry.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="bg-card border-border">
      <div className="p-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-semibold text-foreground">
              Pending renewals
              <span className="ml-2 font-normal text-muted-foreground">({filteredBySearch.length})</span>
            </h3>
            <Select value={filter} onValueChange={(v: RenewalFilter) => setFilter(v)}>
              <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expired">Expired only</SelectItem>
                <SelectItem value="7">Expiring in 7 days</SelectItem>
                <SelectItem value="14">Expiring in 14 days</SelectItem>
                <SelectItem value="30">Expiring in 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-secondary/50 border-border h-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Name</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Email</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Plan</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Days left</TableHead>
                <TableHead className="text-right uppercase text-xs tracking-wider text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBySearch.length > 0 ? (
                filteredBySearch.map((member) => {
                  const days = getDaysRemaining(member.expiry_date)
                  const { text, className } = formatDaysLeft(member.expiry_date)
                  return (
                    <TableRow
                      key={member.id}
                      className={cn('border-border hover:bg-secondary/30', getRowUrgencyClass(days ?? null))}
                    >
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{member.email ?? '—'}</TableCell>
                      <TableCell>{getPlanBadge(member.membership_type)}</TableCell>
                      <TableCell className={className}>{text}</TableCell>
                      <TableCell className="text-right">
                        {days !== null && days <= 7 ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => onRecordPayment(member)}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Register payment
                          </Button>
                        ) : (
                          days !== null &&
                          days > 7 && (
                            <span className="text-xs text-muted-foreground">
                              Renewing in {days}d
                            </span>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No members need renewal in this period
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

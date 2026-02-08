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
import { Edit, Trash2, CreditCard } from 'lucide-react'

export interface MembershipPlan {
  id: number
  name: string
  description: string | null
  price: number
  duration_days: number
  is_active: boolean
}

// Default mock plans (used when no plans prop is passed)
const defaultMockPlans: MembershipPlan[] = [
  { id: 1, name: 'Monthly', description: 'Full gym access, 1 month', price: 49.99, duration_days: 30, is_active: true },
  { id: 2, name: 'Quarterly', description: 'Full gym access, 3 months', price: 129.99, duration_days: 90, is_active: true },
  { id: 3, name: 'Annual Premium', description: 'Full access + personal trainer sessions', price: 399.99, duration_days: 365, is_active: true },
  { id: 4, name: 'Basic', description: 'Gym floor only', price: 29.99, duration_days: 30, is_active: true },
]

export const MOCK_PLANS: MembershipPlan[] = [...defaultMockPlans]

interface PlansTableProps {
  searchTerm: string
  plans?: MembershipPlan[]
  onEditClick?: (plan: MembershipPlan) => void
  onDeleteClick?: (plan: MembershipPlan) => void
}

function formatDuration(days: number): string {
  if (days === 30) return '1 month'
  if (days === 90) return '3 months'
  if (days === 180) return '6 months'
  if (days === 365) return '1 year'
  return `${days} days`
}

export function PlansTable({ searchTerm, plans = defaultMockPlans, onEditClick, onDeleteClick }: PlansTableProps) {
  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader className="bg-secondary/30 border-border">
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Plan</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Description</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Price</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Duration</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">Status</TableHead>
            <TableHead className="text-right uppercase text-xs tracking-wider text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <TableRow key={plan.id} className="border-border/50 hover:bg-secondary/30 transition-colors duration-200">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="font-medium font-mono">{plan.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                  {plan.description || '-'}
                </TableCell>
                <TableCell className="font-mono font-semibold text-primary">
                  ${plan.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {formatDuration(plan.duration_days)}
                </TableCell>
                <TableCell>
                  {plan.is_active ? (
                    <Badge className="bg-green-900 text-green-100">Active</Badge>
                  ) : (
                    <Badge className="bg-muted/50 text-muted-foreground">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-secondary"
                      onClick={() => onEditClick?.(plan)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive/20 text-destructive"
                      onClick={() => onDeleteClick?.(plan)}
                      aria-label="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No plans found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

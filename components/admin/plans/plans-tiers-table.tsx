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
import { Card } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'
import type { PlatformPlan } from '@/lib/types/platform-plans'

interface PlansTiersTableProps {
  tiers: PlatformPlan[]
  onEdit: (tier: PlatformPlan) => void
  onDelete: (tier: PlatformPlan) => void
}

function formatRange(tier: PlatformPlan): string {
  if (tier.max_active_users === null) {
    return `${tier.min_active_users}+`
  }
  return `${tier.min_active_users} – ${tier.max_active_users}`
}

function formatPrice(tier: PlatformPlan): string {
  const base = `$${tier.price_monthly}/mo`
  const threshold = tier.overage_threshold
  const perUser = tier.overage_price_per_user ?? 0
  if (threshold != null && perUser > 0) {
    return `${base} + $${perUser}/user over ${threshold}`
  }
  return base
}

export function PlansTiersTable({ tiers, onEdit, onDelete }: PlansTiersTableProps) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Active users range</TableHead>
              <TableHead>Price (monthly)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.map(tier => (
              <TableRow
                key={tier.id}
                className="border-border hover:bg-secondary/50"
              >
                <TableCell className="font-medium">{tier.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatRange(tier)}
                </TableCell>
                <TableCell className="font-medium text-primary text-sm">
                  {formatPrice(tier)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      tier.is_active
                        ? 'bg-green-900 text-green-100'
                        : 'bg-gray-700 text-gray-100'
                    }
                  >
                    {tier.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-secondary"
                      onClick={() => onEdit(tier)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive/20 text-destructive"
                      onClick={() => onDelete(tier)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

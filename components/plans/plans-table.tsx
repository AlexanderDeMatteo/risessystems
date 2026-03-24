'use client'

import { useTranslations } from 'next-intl'
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
import type { MembershipPlan } from '@/lib/types/plans'

interface PlansTableProps {
  searchTerm: string
  plans: MembershipPlan[]
  onEditClick?: (plan: MembershipPlan) => void
  onDeleteClick?: (plan: MembershipPlan) => void
}

export function PlansTable({ searchTerm, plans, onEditClick, onDeleteClick }: PlansTableProps) {
  const t = useTranslations('plans')
  const tCommon = useTranslations('common')

  const formatDuration = (days: number): string => {
    if (days === 30) return t('duration1Month')
    if (days === 90) return t('duration3Months')
    if (days === 180) return t('duration6Months')
    if (days === 365) return t('duration1Year')
    return t('durationDays', { days })
  }

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
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">{t('planName')}</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">{t('description')}</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">{t('price')}</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">{t('duration')}</TableHead>
            <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">{tCommon('status')}</TableHead>
            <TableHead className="text-right uppercase text-xs tracking-wider text-muted-foreground">{tCommon('actions')}</TableHead>
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
                    <Badge className="bg-green-900 text-green-100">{tCommon('active')}</Badge>
                  ) : (
                    <Badge className="bg-muted/50 text-muted-foreground">{tCommon('inactive')}</Badge>
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
                      aria-label={t('deletePlan')}
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
                {t('noPlans')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

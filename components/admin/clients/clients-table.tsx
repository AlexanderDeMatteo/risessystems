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
import { Card } from '@/components/ui/card'
import { Edit, Trash2, RefreshCw } from 'lucide-react'
import type { AdminClient, PlatformPlan } from '@/app/actions/admin'
import { cn } from '@/lib/utils'
import { getPlanForActiveCount, getMonthlyPriceBreakdown } from '@/lib/utils/platform-pricing'
import type { PlatformPlan as PlatformPlanType } from '@/lib/types/platform-plans'

interface ClientsTableProps {
  clients: AdminClient[]
  plans: PlatformPlan[]
  onChargeClient?: (client: AdminClient) => void
  onEditClient?: (client: AdminClient) => void
}

function getDaysUntilExpiry(dateStr?: string): number | null {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(dateStr)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function SubscriptionCell({ endDate, hasSubscription, t }: { endDate?: string; hasSubscription: boolean; t: (key: string) => string }) {
  if (!hasSubscription) {
    return (
      <Badge className="bg-muted text-muted-foreground border border-border">
        {t('noSubscription')}
      </Badge>
    )
  }
  if (!endDate) return <span className="text-muted-foreground">—</span>

  const days = getDaysUntilExpiry(endDate)
  if (days === null) return <span className="text-muted-foreground">—</span>

  if (days < 0) {
    return (
      <Badge className="bg-destructive/20 text-destructive border border-destructive/50">
        {t('expired')} {Math.abs(days)}{t('daysAgo')}
      </Badge>
    )
  }
  if (days === 0) {
    return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40">{t('today')}</Badge>
  }
  if (days <= 7) {
    return (
      <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40">
        {days}{t('daysLeft')}
      </Badge>
    )
  }
  return (
    <span className="text-muted-foreground text-sm">
      {new Date(endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
    </span>
  )
}

function adaptPlansForCalculation(plans: PlatformPlan[]): PlatformPlanType[] {
  return plans.map((p) => ({
    id: p.id,
    name: p.name,
    min_active_users: p.min_active_users,
    max_active_users: p.max_active_users,
    price_monthly: p.price_monthly,
    is_active: p.is_active,
    sort_order: p.sort_order,
    overage_threshold: p.max_active_users,
    overage_price_per_user: p.overage_price_per_user ?? undefined,
  }))
}

export function ClientsTable({ clients, plans, onChargeClient, onEditClient }: ClientsTableProps) {
  const t = useTranslations('admin')
  const planTiers = adaptPlansForCalculation(plans)
  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>{t('gymName')}</TableHead>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('plan')}</TableHead>
              <TableHead>{t('branches')}</TableHead>
              <TableHead>{t('activeUsers')}</TableHead>
              <TableHead>{t('subscription')}</TableHead>
              <TableHead>{t('joinDate')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? clients.map((client) => {
              const days = getDaysUntilExpiry(client.subscriptionEndDate)
              const hasNoSubscription = !client.subscriptionId
              const showChargeButton = hasNoSubscription || (days !== null && days <= 7)
              const rowUrgency = hasNoSubscription
                ? 'bg-amber-500/10'
                : days !== null && days < 0
                ? 'bg-destructive/10'
                : days !== null && days <= 7
                ? 'bg-amber-500/10'
                : ''

              const calculatedPlan = getPlanForActiveCount(client.activeUsers, planTiers)
              const breakdown = calculatedPlan
                ? getMonthlyPriceBreakdown(calculatedPlan, client.activeUsers)
                : null

              return (
                <TableRow key={client.id} className={cn('border-border hover:bg-secondary/50', rowUrgency)}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{client.email}</TableCell>
                  <TableCell>
                    {calculatedPlan ? (
                      <div className="flex flex-col gap-0.5">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 w-fit">
                          {calculatedPlan.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ${breakdown?.total ?? calculatedPlan.price_monthly}
                          {breakdown && breakdown.overage > 0 && (
                            <span className="text-primary ml-1">(+${breakdown.overage})</span>
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-900/30 text-blue-200 border-blue-700">
                      {client.branches}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-primary">{client.activeUsers}</TableCell>
                  <TableCell>
                    <SubscriptionCell endDate={client.subscriptionEndDate} hasSubscription={!hasNoSubscription} t={t} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{client.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onChargeClient && showChargeButton && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
                          onClick={() => onChargeClient(client)}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          {hasNoSubscription ? t('activate') : t('renew')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-secondary"
                        onClick={() => onEditClient?.(client)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-destructive/20 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            }) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {t('noClientsFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

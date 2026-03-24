'use client'

import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { getPlanForActiveCount, getMonthlyPriceBreakdown } from '@/lib/utils/platform-pricing'
import type { PlatformPlan } from '@/lib/types/platform-plans'
import type { AdminClient } from '@/app/actions/admin'

interface ClientsByPlanProps {
  tiers: PlatformPlan[]
  clients: AdminClient[]
}

export function ClientsByPlan({ tiers, clients }: ClientsByPlanProps) {
  const t = useTranslations('admin')

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {t('clientsByPlan')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('clientsByPlanSubtitle')}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-medium text-foreground">{t('gym')}</th>
                <th className="pb-2 font-medium text-foreground">{t('activeUsers')}</th>
                <th className="pb-2 font-medium text-foreground">{t('assignedPlan')}</th>
                <th className="pb-2 font-medium text-foreground">{t('monthlyTotal')}</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? clients.map((client) => {
                const plan = getPlanForActiveCount(client.activeUsers, tiers)
                const breakdown = plan
                  ? getMonthlyPriceBreakdown(plan, client.activeUsers)
                  : null
                return (
                  <tr
                    key={client.id}
                    className="border-b border-border/50 hover:bg-secondary/30"
                  >
                    <td className="py-3 font-medium">{client.name}</td>
                    <td className="py-3 text-muted-foreground">
                      {client.activeUsers}
                    </td>
                    <td className="py-3 text-primary">
                      {plan ? plan.name : '—'}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {breakdown ? (
                        breakdown.overage > 0 ? (
                          <span>
                            ${breakdown.total}
                            <span className="text-xs ml-1 text-primary">
                              (+${breakdown.overage} {t('overage')})
                            </span>
                          </span>
                        ) : (
                          `$${breakdown.total}`
                        )
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    {t('noClientsYet')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}

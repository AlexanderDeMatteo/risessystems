'use client'

import { Card } from '@/components/ui/card'
import { getPlanForActiveCount, getMonthlyPriceBreakdown } from '@/lib/mocks/platform-plans'
import { MOCK_CLIENTS } from '@/lib/mocks/clients'
import type { PlatformPlan } from '@/lib/types/platform-plans'

interface ClientsByPlanProps {
  tiers: PlatformPlan[]
}

export function ClientsByPlan({ tiers }: ClientsByPlanProps) {
  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Clients by plan
          </h2>
          <p className="text-sm text-muted-foreground">
            Assigned plan is calculated from active user count
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-medium text-foreground">Gym</th>
                <th className="pb-2 font-medium text-foreground">Active users</th>
                <th className="pb-2 font-medium text-foreground">Assigned plan</th>
                <th className="pb-2 font-medium text-foreground">Monthly total</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CLIENTS.map(client => {
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
                              (+${breakdown.overage} overage)
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}

import { getMembershipPlans } from '@/app/actions/plans'
import { PlansPageClient } from './plans-page-client'
import type { MembershipPlan } from '@/lib/types/plans'

function toPlan(r: { id: number; name: string; description: string | null; price: number; duration_days: number; is_active: boolean }): MembershipPlan {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    price: r.price,
    duration_days: r.duration_days,
    is_active: r.is_active,
  }
}

export default async function PlansPage() {
  const result = await getMembershipPlans()
  const plans = result.plans.map(toPlan)
  return (
    <PlansPageClient
      initialPlans={plans}
      plansError={result.error ?? undefined}
    />
  )
}

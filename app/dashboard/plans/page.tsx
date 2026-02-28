import { getMembershipPlans } from '@/app/actions/plans'
import { PlansPageClient } from './plans-page-client'
import type { MembershipPlan } from '@/lib/mocks/plans'

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
  const rows = await getMembershipPlans()
  const plans = rows.map(toPlan)
  return <PlansPageClient initialPlans={plans} />
}

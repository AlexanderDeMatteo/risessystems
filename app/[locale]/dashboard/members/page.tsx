import { MembersPageClient } from './members-page-client'
import { getMembers } from '@/app/actions/members'
import { getMembershipPlans } from '@/app/actions/plans'

export default async function MembersPage() {
  const [{ members, error: membersError }, { plans, error: plansError }] = await Promise.all([
    getMembers(),
    getMembershipPlans(),
  ])

  // If loading plans fails, we still want the page to render.
  const safePlans = plans ?? []

  return (
    <MembersPageClient
      initialMembers={members}
      membersError={membersError ?? undefined}
      initialPlans={safePlans}
    />
  )
}


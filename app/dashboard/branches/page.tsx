import { getBranches } from '@/app/actions/branches'
import { getMemberCountByBranch } from '@/app/actions/members'
import { BranchesPageClient } from './branches-page-client'
import type { BranchGridItem } from '@/components/branches/branches-grid'

function toGridItem(
  r: { id: number; name: string; address: string | null; phone: string | null; email: string | null; is_active: boolean },
  memberCountByBranch: Record<number, number>
): BranchGridItem {
  return {
    id: r.id,
    name: r.name,
    address: r.address,
    phone: r.phone,
    email: r.email,
    status: r.is_active ? 'active' : 'inactive',
    members: memberCountByBranch[r.id] ?? 0,
  }
}

export default async function BranchesPage() {
  const [branchesResult, memberCountByBranch] = await Promise.all([getBranches(), getMemberCountByBranch()])
  const gridBranches = branchesResult.branches.map((r) => toGridItem(r, memberCountByBranch))
  return (
    <BranchesPageClient initialBranches={gridBranches} branchesError={branchesResult.error ?? undefined} />
  )
}

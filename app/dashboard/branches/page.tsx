import { getBranches } from '@/app/actions/branches'
import { BranchesPageClient } from './branches-page-client'
import type { BranchGridItem } from '@/components/branches/branches-grid'

function toGridItem(r: { id: number; name: string; address: string | null; phone: string | null; email: string | null; is_active: boolean }): BranchGridItem {
  return {
    id: r.id,
    name: r.name,
    address: r.address,
    phone: r.phone,
    email: r.email,
    status: r.is_active ? 'active' : 'inactive',
    members: 0,
  }
}

export default async function BranchesPage() {
  const branches = await getBranches()
  const gridBranches = branches.map(toGridItem)
  return <BranchesPageClient initialBranches={gridBranches} />
}

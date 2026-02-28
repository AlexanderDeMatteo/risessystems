import { getTrainers } from '@/app/actions/trainers'
import { getBranches } from '@/app/actions/branches'
import { TrainersPageClient } from './trainers-page-client'
import type { Trainer } from '@/components/trainers/edit-trainer-dialog'

function toTrainer(
  r: { id: number; name: string; email: string; phone: string | null; specialties: string | null; branch_id: number | null; status: string; is_primary: boolean; hire_date: string | null },
  branchNameById: Map<number, string>
): Trainer {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? '',
    branch: r.branch_id != null ? branchNameById.get(r.branch_id) ?? '' : '',
    specialties: r.specialties ?? '',
    status: r.status as 'active' | 'inactive',
    isPrimary: r.is_primary,
    hireDate: r.hire_date ?? undefined,
  }
}

export default async function TrainersPage() {
  const [trainers, branches] = await Promise.all([getTrainers(), getBranches()])
  const branchNameById = new Map(branches.map((b) => [b.id, b.name]))
  const trainerList = trainers.map((t) => toTrainer(t, branchNameById))
  const branchOptions = branches.map((b) => ({ id: String(b.id), name: b.name }))
  return <TrainersPageClient initialTrainers={trainerList} branchOptions={branchOptions} />
}

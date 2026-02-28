import { getMembers } from '@/app/actions/members'
import { MembersPageClient } from './members-page-client'

export default async function MembersPage() {
  const initialMembers = await getMembers()
  return <MembersPageClient initialMembers={initialMembers} />
}

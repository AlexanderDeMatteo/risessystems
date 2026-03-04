import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/app/actions/profile'
import { AdminProfileClient } from './admin-profile-client'

export default async function AdminProfilePage() {
  const userProfile = await getCurrentUserProfile()
  if (!userProfile) redirect('/login')

  return <AdminProfileClient userProfile={userProfile} />
}

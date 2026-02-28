import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/app/actions/profile'
import { getDashboardCounts } from '@/app/actions/dashboard'
import { getMySubscription } from '@/lib/mocks/platform-plans'
import { ProfilePageClient } from './profile-page-client'

export default async function ProfilePage() {
  const [userProfile, counts] = await Promise.all([
    getCurrentUserProfile(),
    getDashboardCounts(),
  ])
  if (!userProfile) redirect('/login')

  const subscription = {
    ...getMySubscription(),
    activeMembersCount: counts.memberCount,
  }

  return (
    <ProfilePageClient
      userProfile={userProfile}
      subscription={subscription}
    />
  )
}

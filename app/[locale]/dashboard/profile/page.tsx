import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/app/actions/profile'
import { getDashboardCounts } from '@/app/actions/dashboard'
import { getMySubscriptionInfo } from '@/app/actions/subscription'
import { ProfilePageClient } from './profile-page-client'

export default async function ProfilePage() {
  const [userProfile, countsResult] = await Promise.all([
    getCurrentUserProfile(),
    getDashboardCounts(),
  ])
  if (!userProfile) redirect('/login')

  const subscription = await getMySubscriptionInfo(countsResult.counts.memberCount)

  return (
    <ProfilePageClient
      userProfile={userProfile}
      subscription={subscription}
    />
  )
}

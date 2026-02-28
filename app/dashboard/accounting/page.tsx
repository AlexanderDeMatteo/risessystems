import { getPayments } from '@/app/actions/payments'
import { getMembers } from '@/app/actions/members'
import { getMembershipPlans } from '@/app/actions/plans'
import { getRevenueChartData } from '@/app/actions/dashboard'
import { AccountingPageClient } from './accounting-page-client'
import type { Member } from '@/components/members/members-table'

export default async function AccountingPage() {
  const [payments, members, plans, revenueChartData] = await Promise.all([
    getPayments(50),
    getMembers(),
    getMembershipPlans(),
    getRevenueChartData(6),
  ])

  const memberOptions = members.map((m) => ({
    id: m.id,
    name: m.name,
    membership_type: m.membership_type,
  }))
  const planOptions = plans.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    is_active: p.is_active,
  }))

  const membersForRenewals: Member[] = members.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    membership_type: m.membership_type,
    status: m.status,
    join_date: m.join_date,
    expiry_date: m.expiry_date,
  }))

  const initialPayments = payments.map((p) => ({
    id: p.id,
    name: p.name,
    amount: p.amount,
    payment_method: p.payment_method,
    status: p.status,
    payment_date: p.payment_date,
  }))

  return (
    <AccountingPageClient
      initialPayments={initialPayments}
      memberOptions={memberOptions}
      planOptions={planOptions}
      membersForRenewals={membersForRenewals}
      revenueChartData={revenueChartData}
    />
  )
}

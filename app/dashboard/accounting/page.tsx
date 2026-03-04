import { getPayments, getAccountingStats } from '@/app/actions/payments'
import { getMembers } from '@/app/actions/members'
import { getMembershipPlans } from '@/app/actions/plans'
import { getRevenueChartData, getDashboardCounts } from '@/app/actions/dashboard'
import { AccountingPageClient } from './accounting-page-client'
import type { Member } from '@/components/members/members-table'

export default async function AccountingPage() {
  const [paymentsResult, membersResult, plansResult, revenueChartData, accountingStatsResult, countsResult] = await Promise.all([
    getPayments(50),
    getMembers(),
    getMembershipPlans(),
    getRevenueChartData(6),
    getAccountingStats(),
    getDashboardCounts(),
  ])

  const payments = paymentsResult.payments
  const members = membersResult.members
  const plans = plansResult.plans
  const accountingStats = accountingStatsResult.stats
  const accountingStatsError = accountingStatsResult.error
  const counts = countsResult.counts
  const { paymentMethodBreakdown } = accountingStats
  const totalByMethod = paymentMethodBreakdown.cash + paymentMethodBreakdown.card + paymentMethodBreakdown.bank_transfer
  const paymentMethodPercents = {
    cash: totalByMethod > 0 ? Math.round((paymentMethodBreakdown.cash / totalByMethod) * 100) : 0,
    card: totalByMethod > 0 ? Math.round((paymentMethodBreakdown.card / totalByMethod) * 100) : 0,
    bank_transfer: totalByMethod > 0 ? Math.round((paymentMethodBreakdown.bank_transfer / totalByMethod) * 100) : 0,
  }

  const memberOptions = members.map((m) => ({
    id: m.id,
    name: m.name,
    membership_type: m.membership_type,
  }))
  const planOptions = plans.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    duration_days: p.duration_days,
    is_active: p.is_active,
  }))

  const inactiveMembers: Member[] = members
    .filter((m) => m.status === 'inactive')
    .map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      membership_type: m.membership_type,
      status: m.status,
      join_date: m.join_date,
      expiry_date: m.expiry_date,
    }))

  const membersForRenewals: Member[] = members
    .filter((m) => m.status === 'active' || m.status === 'expired')
    .map((m) => ({
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
    payment_type: p.payment_type,
    status: p.status,
    payment_date: p.payment_date,
  }))

  return (
    <AccountingPageClient
      initialPayments={initialPayments}
      memberOptions={memberOptions}
      planOptions={planOptions}
      inactiveMembers={inactiveMembers}
      membersForRenewals={membersForRenewals}
      revenueChartData={revenueChartData}
      accountingStats={accountingStats}
      activeMembersCount={counts.memberCount}
      paymentMethodPercents={paymentMethodPercents}
      statsError={accountingStatsError}
      paymentsError={paymentsResult.error ?? undefined}
      plansError={plansResult.error ?? undefined}
    />
  )
}

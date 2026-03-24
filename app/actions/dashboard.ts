'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import type { DashboardCounts, SalesChartPoint, MembershipPieSegment, RevenueChartPoint, RecentActivityItem } from '@/lib/types/dashboard'
import { getCheckIns } from './check-ins'
import { getPayments } from './payments'
import { getTranslations } from 'next-intl/server'

const emptyCounts: DashboardCounts = {
  memberCount: 0,
  trainerCount: 0,
  branchCount: 0,
  checkInsToday: 0,
  revenueThisMonth: 0,
  revenueLastMonth: 0,
  membersThisMonth: 0,
}

export type GetDashboardCountsResult = { counts: DashboardCounts; error: null } | { counts: DashboardCounts; error: string }

export async function getDashboardCounts(): Promise<GetDashboardCountsResult> {
  const userId = await getCurrentAppUserId()
  if (!userId) {
    return { counts: emptyCounts, error: null }
  }
  const supabase = await createClient()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [membersRes, trainersRes, branchesRes, paymentsThisMonthRes, paymentsLastMonthRes, membersThisMonthRes] = await Promise.all([
    supabase.from('members').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'active'),
    supabase.from('trainers').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('branches').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('payments').select('amount').eq('user_id', userId).eq('status', 'completed').gte('paid_at', monthStart).lt('paid_at', monthEnd),
    supabase.from('payments').select('amount').eq('user_id', userId).eq('status', 'completed').gte('paid_at', lastMonthStart).lt('paid_at', lastMonthEnd),
    supabase.from('members').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('join_date', monthStart.slice(0, 10)).lt('join_date', monthEnd.slice(0, 10)),
  ])

  if (membersRes.error || trainersRes.error || branchesRes.error || paymentsThisMonthRes.error || paymentsLastMonthRes.error || membersThisMonthRes.error) {
    const t = await getTranslations('errors')
    const err = membersRes.error || trainersRes.error || branchesRes.error || paymentsThisMonthRes.error || membersThisMonthRes.error
    return { counts: emptyCounts, error: err?.message ?? t('failedToLoadDashboardCounts') }
  }

  const checkInsToday = await (async () => {
    const memberIds = await supabase.from('members').select('id').eq('user_id', userId)
    if (memberIds.error || !memberIds.data?.length) return 0
    const ids = memberIds.data.map((r) => r.id)
    const { count } = await supabase
      .from('check_ins')
      .select('*', { count: 'exact', head: true })
      .in('member_id', ids)
      .gte('check_in_time', todayStart)
      .lt('check_in_time', todayEnd)
    return count ?? 0
  })()

  const revenueThisMonth = (paymentsThisMonthRes.data ?? []).reduce((s, r) => s + Number(r.amount), 0)
  const revenueLastMonth = (paymentsLastMonthRes.data ?? []).reduce((s, r) => s + Number(r.amount), 0)

  return {
    counts: {
      memberCount: membersRes.count ?? 0,
      trainerCount: trainersRes.count ?? 0,
      branchCount: branchesRes.count ?? 0,
      checkInsToday,
      revenueThisMonth,
      revenueLastMonth,
      membersThisMonth: membersThisMonthRes.count ?? 0,
    },
    error: null,
  }
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatShortDate(d: Date): string {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
}

export type GetSalesChartResult =
  | { data: SalesChartPoint[]; error: null }
  | { data: SalesChartPoint[]; error: string }

export async function getSalesChartData(days = 30): Promise<GetSalesChartResult> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { data: [], error: t('notAuthenticated') }
  const supabase = await createClient()
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - days)
  const startStr = start.toISOString()
  const endStr = end.toISOString()

  const memberIds = await supabase.from('members').select('id').eq('user_id', userId)
  if (memberIds.error) return { data: [], error: memberIds.error.message }
  const ids = (memberIds.data ?? []).map((r) => r.id)
  let data: SalesChartPoint[]
  if (ids.length === 0) {
    data = Array.from({ length: Math.min(days, 7) }, (_, i) => {
      const d = new Date(end)
      d.setDate(d.getDate() - (days - 1 - i))
      return { date: formatShortDate(d), sales: 0, members: 0, checkins: 0 }
    })
  } else {
    const [paymentsRes, checkInsRes] = await Promise.all([
      supabase.from('payments').select('amount, paid_at').eq('user_id', userId).eq('status', 'completed').gte('paid_at', startStr).lte('paid_at', endStr),
      supabase.from('check_ins').select('check_in_time').in('member_id', ids).gte('check_in_time', startStr).lte('check_in_time', endStr),
    ])
    if (paymentsRes.error || checkInsRes.error) {
      const err = paymentsRes.error || checkInsRes.error
      return { data: [], error: err?.message ?? t('failedToLoadSalesChartData') }
    }
    const byDate: Record<string, { sales: number; checkins: number }> = {}
    for (let i = 0; i < days; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      byDate[key] = { sales: 0, checkins: 0 }
    }
    for (const p of paymentsRes.data ?? []) {
      const key = (p.paid_at as string).slice(0, 10)
      if (byDate[key]) byDate[key].sales += Number(p.amount)
    }
    for (const c of checkInsRes.data ?? []) {
      const key = (c.check_in_time as string).slice(0, 10)
      if (byDate[key]) byDate[key].checkins += 1
    }
    data = Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => {
        const d = new Date(key)
        return { date: formatShortDate(d), sales: v.sales, members: 0, checkins: v.checkins }
      })
  }
  return { data, error: null }
}

const MEMBERSHIP_COLORS: Record<string, string> = {
  premium: '#3B82F6',
  standard: '#10B981',
  basic: '#F59E0B',
}

export type GetMembershipDistResult =
  | { data: MembershipPieSegment[]; error: null }
  | { data: MembershipPieSegment[]; error: string }

export async function getMembershipDistribution(): Promise<GetMembershipDistResult> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { data: [], error: t('notAuthenticated') }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('members')
    .select('membership_type')
    .eq('user_id', userId)
    .eq('status', 'active')
  if (error) return { data: [], error: error.message }
  const byType: Record<string, number> = {}
  for (const r of data ?? []) {
    const t = (r.membership_type as string)?.toLowerCase() ?? 'other'
    byType[t] = (byType[t] ?? 0) + 1
  }
  const result = Object.entries(byType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: MEMBERSHIP_COLORS[name] ?? '#6B7280',
  }))
  return { data: result, error: null }
}

export type GetRevenueChartResult =
  | { data: RevenueChartPoint[]; error: null }
  | { data: RevenueChartPoint[]; error: string }

export async function getRevenueChartData(months = 6): Promise<GetRevenueChartResult> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { data: [], error: t('notAuthenticated') }
  const supabase = await createClient()
  const end = new Date()
  const start = new Date(end.getFullYear(), end.getMonth() - months, 1)
  const { data, error } = await supabase
    .from('payments')
    .select('amount, paid_at, payment_type')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .gte('paid_at', start.toISOString())
    .lte('paid_at', end.toISOString())
  if (error) return { data: [], error: error.message }
  const byMonth: Record<string, { memberships: number; training: number; other: number }> = {}
  for (let i = 0; i < months; i++) {
    const d = new Date(end.getFullYear(), end.getMonth() - (months - 1 - i), 1)
    byMonth[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = { memberships: 0, training: 0, other: 0 }
  }
  for (const p of data ?? []) {
    const key = (p.paid_at as string).slice(0, 7)
    if (!byMonth[key]) continue
    const type = (p.payment_type as string)?.toLowerCase()
    const amount = Number(p.amount)
    if (type === 'membership') byMonth[key].memberships += amount
    else if (type === 'personal_training') byMonth[key].training += amount
    else byMonth[key].other += amount
  }
  const result = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => {
      const [y, m] = key.split('-')
      const name = MONTH_NAMES[parseInt(m, 10) - 1]
      return { name, ...v }
    })
  return { data: result, error: null }
}

function timeAgo(iso: string): string {
  const d = new Date(iso)
  const sec = Math.floor((Date.now() - d.getTime()) / 1000)
  if (sec < 60) return 'Just now'
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`
  if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`
  return d.toLocaleDateString()
}

export async function getRecentActivity(limit = 10): Promise<RecentActivityItem[]> {
  const userId = await getCurrentAppUserId()
  if (!userId) return []
  const [checkInsResult, paymentsResult] = await Promise.all([getCheckIns(limit), getPayments(limit)])
  const checkIns = checkInsResult.checkIns
  const payments = paymentsResult.payments
  const items: (RecentActivityItem & { _ts: string })[] = []
  for (const c of checkIns) {
    items.push({
      id: `checkin-${c.id}`,
      type: 'checkin',
      description: 'Member check-in',
      member: c.member_name,
      time: timeAgo(c.check_in_time),
      color: 'bg-blue-500/10 text-blue-400',
      _ts: c.check_in_time,
    })
  }
  for (const p of payments) {
    items.push({
      id: `payment-${p.id}`,
      type: 'payment',
      description: 'Payment received',
      member: p.name,
      time: timeAgo(p.payment_date),
      color: 'bg-purple-500/10 text-purple-400',
      _ts: p.payment_date,
    })
  }
  items.sort((a, b) => b._ts.localeCompare(a._ts))
  return items.slice(0, limit).map(({ _ts: _, ...item }) => item)
}

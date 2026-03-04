'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'

export type InviteClientResult = { ok: true; message: string } | { ok: false; error: string }

export type CreateClientResult = { ok: true; message: string } | { ok: false; error: string }

/** Creates a gym owner client with an admin-assigned password. No email/SMTP. For production with domain, use inviteClient instead. */
export async function createClientWithPassword(payload: {
  email: string
  password: string
  contactPerson: string
  gymName: string
}): Promise<CreateClientResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) {
    return { ok: false, error: 'Only admins can create clients.' }
  }
  try {
    const supabase = createAdminClient()
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        full_name: payload.contactPerson,
        gym_name: payload.gymName || undefined,
      },
    })
    if (createError) {
      return { ok: false, error: createError.message }
    }
    if (!authUser.user) {
      return { ok: false, error: 'User was not created.' }
    }
    const name =
      (authUser.user.user_metadata?.full_name as string) ||
      authUser.user.email?.split('@')[0] ||
      'User'
    const gymName = (authUser.user.user_metadata?.gym_name as string) || null
    const { error: insertError } = await supabase.from('users').insert({
      auth_user_id: authUser.user.id,
      email: authUser.user.email ?? payload.email,
      name,
      gym_name: gymName,
      role: 'owner',
      is_active: false,
    })
    if (insertError) {
      return { ok: false, error: insertError.message }
    }
    revalidatePath('/admin/clients')
    return {
      ok: true,
      message: `Client created. ${payload.email} can sign in with the assigned password and change it in Profile.`,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create client.'
    return { ok: false, error: msg }
  }
}

export async function inviteClient(payload: {
  email: string
  contactPerson: string
  gymName: string
  redirectTo: string
}): Promise<InviteClientResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) {
    return { ok: false, error: 'Only admins can invite clients.' }
  }
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(payload.email, {
      data: {
        full_name: payload.contactPerson,
        gym_name: payload.gymName || undefined,
      },
      redirectTo: payload.redirectTo,
    })
    if (error) {
      return { ok: false, error: error.message }
    }
    revalidatePath('/admin/clients')
    return { ok: true, message: `Invitation sent to ${payload.email}. The client will receive a magic link to access their account.` }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to send invitation.'
    return { ok: false, error: msg }
  }
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const userId = await getCurrentAppUserId()
  if (!userId) return false
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle()
  return (data as { role?: string } | null)?.role === 'admin'
}

export type AdminKpi = {
  label: string
  value: string
  change: string
  iconKey: 'Building2' | 'TrendingUp' | 'Users' | 'DollarSign'
  color: string
}

const emptyAdminKpis: AdminKpi[] = [
  { label: 'Total Clients', value: '0', change: '—', iconKey: 'Building2', color: 'bg-blue-500/20 text-blue-400' },
  { label: 'Total Branches', value: '0', change: '—', iconKey: 'TrendingUp', color: 'bg-green-500/20 text-green-400' },
  { label: 'Active Affiliados', value: '0', change: '—', iconKey: 'Users', color: 'bg-purple-500/20 text-purple-400' },
  { label: 'Platform Revenue', value: '$0', change: '—', iconKey: 'DollarSign', color: 'bg-orange-500/20 text-orange-400' },
]

export type GetAdminKPIsResult = { data: AdminKpi[]; error: null } | { data: AdminKpi[]; error: string }

export async function getAdminKPIs(): Promise<GetAdminKPIsResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: emptyAdminKpis, error: null }
  const supabase = await createClient()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [usersRes, branchesRes, membersRes, platformPaymentsThisMonthRes, platformPaymentsLastMonthRes, clientsThisMonthRes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'owner'),
    supabase.from('branches').select('id', { count: 'exact', head: true }),
    supabase.from('members').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('platform_payments').select('amount').eq('status', 'completed').gte('paid_at', monthStart).lt('paid_at', monthEnd),
    supabase.from('platform_payments').select('amount').eq('status', 'completed').gte('paid_at', lastMonthStart).lt('paid_at', lastMonthEnd),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'owner').gte('created_at', monthStart).lt('created_at', monthEnd),
  ])
  const err = usersRes.error || branchesRes.error || membersRes.error || platformPaymentsThisMonthRes.error || platformPaymentsLastMonthRes.error || clientsThisMonthRes.error
  if (err) return { data: emptyAdminKpis, error: err.message }
  const totalClients = usersRes.count
  const totalBranches = branchesRes.count
  const activeAffiliados = membersRes.count
  const platformPaymentsThisMonth = platformPaymentsThisMonthRes.data
  const platformPaymentsLastMonth = platformPaymentsLastMonthRes.data
  const clientsThisMonth = clientsThisMonthRes.count

  const platformRevenueThisMonth = (platformPaymentsThisMonth ?? []).reduce((s, r) => s + Number(r.amount), 0)
  const platformRevenueLastMonth = (platformPaymentsLastMonth ?? []).reduce((s, r) => s + Number(r.amount), 0)
  const revenueChange =
    platformRevenueLastMonth > 0 ? `+${Math.round(((platformRevenueThisMonth - platformRevenueLastMonth) / platformRevenueLastMonth) * 100)}% vs last month` : '—'
  const clientsChange = (clientsThisMonth ?? 0) > 0 ? `+${clientsThisMonth} this month` : '—'

  return {
    data: [
      { label: 'Total Clients', value: String(totalClients ?? 0), change: clientsChange, iconKey: 'Building2', color: 'bg-blue-500/20 text-blue-400' },
      { label: 'Total Branches', value: String(totalBranches ?? 0), change: '—', iconKey: 'TrendingUp', color: 'bg-green-500/20 text-green-400' },
      { label: 'Active Affiliados', value: new Intl.NumberFormat('en-US').format(activeAffiliados ?? 0), change: 'Members across all gyms', iconKey: 'Users', color: 'bg-purple-500/20 text-purple-400' },
      { label: 'Platform Revenue', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(platformRevenueThisMonth), change: revenueChange, iconKey: 'DollarSign', color: 'bg-orange-500/20 text-orange-400' },
    ],
    error: null,
  }
}

export type AdminClient = {
  id: number
  name: string
  email: string
  phone: string
  branches: number
  activeUsers: number
  status: string
  joinDate: string
  subscriptionId?: number
  subscriptionStatus?: string
  subscriptionEndDate?: string
  planName?: string
  planId?: number
}

export type GetAdminClientsResult = { data: AdminClient[]; error: null } | { data: AdminClient[]; error: string }

export async function getAdminClients(): Promise<GetAdminClientsResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: [], error: null }
  const supabase = await createClient()
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name, email, gym_name, created_at, is_active')
    .eq('role', 'owner')
    .order('created_at', { ascending: false })
  if (usersError) return { data: [], error: usersError.message }
  if (!users?.length) return { data: [], error: null }

  const userIds = users.map((u) => u.id)
  const [branchRes, memberRes, subRes] = await Promise.all([
    supabase.from('branches').select('user_id'),
    supabase.from('members').select('user_id, status').eq('status', 'active'),
    supabase.from('platform_subscriptions')
      .select('id, user_id, status, current_period_end, platform_plan_id, platform_plans(id, name)')
      .in('user_id', userIds)
      .eq('status', 'active'),
  ])
  if (branchRes.error || memberRes.error) return { data: [], error: (branchRes.error || memberRes.error)?.message ?? 'Failed to load client data' }

  const branchesByUser: Record<number, number> = {}
  const activeByUser: Record<number, number> = {}
  const subByUser: Record<number, { id: number; status: string; current_period_end: string | null; planName: string; planId: number }> = {}

  for (const b of branchRes.data ?? []) {
    const uid = (b as { user_id: number }).user_id
    branchesByUser[uid] = (branchesByUser[uid] ?? 0) + 1
  }
  for (const m of memberRes.data ?? []) {
    const uid = (m as { user_id: number }).user_id
    activeByUser[uid] = (activeByUser[uid] ?? 0) + 1
  }
  for (const s of subRes.data ?? []) {
    const row = s as { id: number; user_id: number; status: string; current_period_end: string | null; platform_plan_id: number; platform_plans: { id: number; name: string } | { id: number; name: string }[] | null }
    const plan = row.platform_plans
      ? Array.isArray(row.platform_plans) ? row.platform_plans[0] : row.platform_plans
      : null
    subByUser[row.user_id] = {
      id: row.id,
      status: row.status,
      current_period_end: row.current_period_end,
      planName: plan?.name ?? '—',
      planId: plan?.id ?? row.platform_plan_id,
    }
  }

  const data = users.map((u) => {
    const row = u as { id: number; name: string; email: string; gym_name: string | null; created_at: string; is_active: boolean }
    const sub = subByUser[row.id]
    return {
      id: row.id,
      name: row.gym_name ?? row.name ?? '—',
      email: row.email ?? '',
      phone: '',
      branches: branchesByUser[row.id] ?? 0,
      activeUsers: activeByUser[row.id] ?? 0,
      status: row.is_active !== false ? 'active' : 'inactive',
      joinDate: row.created_at ? new Date(row.created_at).toLocaleDateString() : '—',
      subscriptionId: sub?.id,
      subscriptionStatus: sub?.status,
      subscriptionEndDate: sub?.current_period_end ?? undefined,
      planName: sub?.planName,
      planId: sub?.planId,
    }
  })
  return { data, error: null }
}

export type GetAdminClientsOverviewResult = { data: AdminClient[]; error: null } | { data: AdminClient[]; error: string }

/** Top N clients by active member count, for overview widget. */
export async function getAdminClientsOverview(limit = 5): Promise<GetAdminClientsOverviewResult> {
  const res = await getAdminClients()
  if (res.error) return { data: [], error: res.error }
  const data = res.data
    .sort((a, b) => b.activeUsers - a.activeUsers)
    .slice(0, limit)
  return { data, error: null }
}

export type ActiveUsersChartPoint = {
  month: string
  users: number
  activeRate?: number
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export type GetAdminActiveUsersChartResult = { data: ActiveUsersChartPoint[]; error: null } | { data: ActiveUsersChartPoint[]; error: string }

/** Active users (members) count by month for the last 6 months. */
export async function getAdminActiveUsersChartData(months = 6): Promise<GetAdminActiveUsersChartResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: [], error: null }
  const supabase = await createClient()
  const end = new Date()
  const start = new Date(end.getFullYear(), end.getMonth() - months, 1)
  const { data: members, error } = await supabase
    .from('members')
    .select('created_at')
    .gte('created_at', start.toISOString())
  if (error) return { data: [], error: error.message }
  const byMonth: Record<string, number> = {}
  for (let i = 0; i < months; i++) {
    const d = new Date(end.getFullYear(), end.getMonth() - (months - 1 - i), 1)
    byMonth[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 0
  }
  for (const m of members ?? []) {
    const created = (m as { created_at: string }).created_at
    const key = created.slice(0, 7)
    if (byMonth[key] != null) byMonth[key] += 1
  }
  const data = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      const [, m] = key.split('-').map(Number)
      return { month: MONTH_NAMES[m - 1], users: count }
    })
  return { data, error: null }
}

// --- Admin Accounting ---

export type AdminRevenueStat = {
  label: string
  value: string
  change: string
  iconKey: string
  color: string
}

const emptyAdminRevenueStats: AdminRevenueStat[] = [
  { label: 'Total Revenue', value: '$0', change: '—', iconKey: 'DollarSign', color: 'bg-green-500/20 text-green-400' },
  { label: 'Monthly Recurring', value: '$0', change: '—', iconKey: 'TrendingUp', color: 'bg-blue-500/20 text-blue-400' },
  { label: 'Avg. Client Value', value: '$0', change: '—', iconKey: 'Target', color: 'bg-purple-500/20 text-purple-400' },
  { label: 'Pending Payments', value: '$0', change: '—', iconKey: 'Calendar', color: 'bg-orange-500/20 text-orange-400' },
]

export type GetAdminRevenueStatsResult = { data: AdminRevenueStat[]; error: null } | { data: AdminRevenueStat[]; error: string }

export async function getAdminRevenueStats(): Promise<GetAdminRevenueStatsResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: emptyAdminRevenueStats, error: null }
  const supabase = await createClient()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [paymentsThisMonthRes, paymentsLastMonthRes, pendingPaymentsRes, ownerCountRes] = await Promise.all([
    supabase.from('payments').select('amount').eq('status', 'completed').gte('paid_at', monthStart).lt('paid_at', monthEnd),
    supabase.from('payments').select('amount').eq('status', 'completed').gte('paid_at', lastMonthStart).lt('paid_at', lastMonthEnd),
    supabase.from('payments').select('amount').eq('status', 'pending'),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'owner'),
  ])
  const err = paymentsThisMonthRes.error || paymentsLastMonthRes.error || pendingPaymentsRes.error || ownerCountRes.error
  if (err) return { data: emptyAdminRevenueStats, error: err.message }

  const paymentsThisMonth = paymentsThisMonthRes.data
  const paymentsLastMonth = paymentsLastMonthRes.data
  const pendingPayments = pendingPaymentsRes.data
  const ownerCount = ownerCountRes.count

  const revenueThisMonth = (paymentsThisMonth ?? []).reduce((s, r) => s + Number(r.amount), 0)
  const revenueLastMonth = (paymentsLastMonth ?? []).reduce((s, r) => s + Number(r.amount), 0)
  const pendingAmount = (pendingPayments ?? []).reduce((s, r) => s + Number(r.amount), 0)
  const clients = ownerCount ?? 0
  const avgClientValue = clients > 0 ? revenueThisMonth / clients : 0
  const changePct =
    revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) : 0

  return {
    data: [
      { label: 'Total Revenue', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(revenueThisMonth), change: changePct !== 0 ? `${changePct > 0 ? '+' : ''}${changePct}% vs last month` : '—', iconKey: 'DollarSign', color: 'bg-green-500/20 text-green-400' },
      { label: 'Monthly Recurring', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(revenueThisMonth), change: 'From completed payments', iconKey: 'TrendingUp', color: 'bg-blue-500/20 text-blue-400' },
      { label: 'Avg. Client Value', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(avgClientValue), change: 'Per gym client', iconKey: 'Target', color: 'bg-purple-500/20 text-purple-400' },
      { label: 'Pending Payments', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pendingAmount), change: 'Awaiting settlement', iconKey: 'Calendar', color: 'bg-orange-500/20 text-orange-400' },
    ],
    error: null,
  }
}

export type AdminRevenueChartPoint = {
  month: string
  revenue: number
  subscriptions?: number
  oneTime?: number
}

export type GetAdminRevenueChartResult = { data: AdminRevenueChartPoint[]; error: null } | { data: AdminRevenueChartPoint[]; error: string }

export async function getAdminRevenueChartData(months = 6): Promise<GetAdminRevenueChartResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: [], error: null }
  const supabase = await createClient()
  const end = new Date()
  const start = new Date(end.getFullYear(), end.getMonth() - months, 1)
  const { data, error } = await supabase
    .from('payments')
    .select('amount, paid_at, payment_type')
    .eq('status', 'completed')
    .gte('paid_at', start.toISOString())
  if (error) return { data: [], error: error.message }
  const byMonth: Record<string, { revenue: number; subscriptions: number; oneTime: number }> = {}
  for (let i = 0; i < months; i++) {
    const d = new Date(end.getFullYear(), end.getMonth() - (months - 1 - i), 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    byMonth[key] = { revenue: 0, subscriptions: 0, oneTime: 0 }
  }
  for (const p of data ?? []) {
    const key = (p.paid_at as string).slice(0, 7)
    if (!byMonth[key]) continue
    const amount = Number(p.amount)
    const type = (p.payment_type as string)?.toLowerCase()
    byMonth[key].revenue += amount
    if (type === 'membership') byMonth[key].subscriptions += amount
    else byMonth[key].oneTime += amount
  }
  const result = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => {
      const [, m] = key.split('-').map(Number)
      return { month: MONTH_NAMES[m - 1], revenue: v.revenue, subscriptions: v.subscriptions, oneTime: v.oneTime }
    })
  return { data: result, error: null }
}

export type AdminPayment = {
  id: number
  clientName: string
  amount: number
  paymentMethod: string
  status: string
  paymentDate: string
}

export type GetAdminPaymentsResult = { data: AdminPayment[]; error: null } | { data: AdminPayment[]; error: string }

export async function getAdminPayments(limit = 50): Promise<GetAdminPaymentsResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: [], error: null }
  const supabase = await createClient()
  const { data: payments, error } = await supabase
    .from('payments')
    .select('id, amount, payment_method, status, paid_at, user_id')
    .order('paid_at', { ascending: false })
    .limit(limit)
  if (error) return { data: [], error: error.message }
  const userIds = [...new Set((payments ?? []).map((p) => (p as { user_id: number }).user_id))]
  const userMap: Record<number, string> = {}
  if (userIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, gym_name, name')
      .in('id', userIds)
    if (usersError) return { data: [], error: usersError.message }
    for (const u of users ?? []) {
      const row = u as { id: number; gym_name: string | null; name: string }
      userMap[row.id] = row.gym_name ?? row.name ?? '—'
    }
  }
  const data = (payments ?? []).map((r: unknown) => {
    const row = r as { id: number; amount: number; payment_method: string; status: string; paid_at: string; user_id: number }
    const method = (row.payment_method ?? 'cash').toLowerCase()
    const methodLabel = method === 'bank_transfer' ? 'Bank Transfer' : method.charAt(0).toUpperCase() + method.slice(1)
    return {
      id: row.id,
      clientName: userMap[row.user_id] ?? '—',
      amount: Number(row.amount),
      paymentMethod: methodLabel,
      status: row.status ?? 'completed',
      paymentDate: row.paid_at ?? new Date().toISOString(),
    }
  })
  return { data, error: null }
}

// --- Admin Platform Accounting (gym→platform payments) ---

export type GetAdminPlatformRevenueStatsResult = { data: AdminRevenueStat[]; error: null } | { data: AdminRevenueStat[]; error: string }

export async function getAdminPlatformRevenueStats(): Promise<GetAdminPlatformRevenueStatsResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: emptyAdminRevenueStats, error: null }
  const supabase = await createClient()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [paymentsThisMonthRes, paymentsLastMonthRes, pendingPaymentsRes, ownerCountRes] = await Promise.all([
    supabase.from('platform_payments').select('amount').eq('status', 'completed').gte('paid_at', monthStart).lt('paid_at', monthEnd),
    supabase.from('platform_payments').select('amount').eq('status', 'completed').gte('paid_at', lastMonthStart).lt('paid_at', lastMonthEnd),
    supabase.from('platform_payments').select('amount').eq('status', 'pending'),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'owner'),
  ])
  const err = paymentsThisMonthRes.error || paymentsLastMonthRes.error || pendingPaymentsRes.error || ownerCountRes.error
  if (err) return { data: emptyAdminRevenueStats, error: err.message }

  const paymentsThisMonth = paymentsThisMonthRes.data
  const paymentsLastMonth = paymentsLastMonthRes.data
  const pendingPayments = pendingPaymentsRes.data
  const ownerCount = ownerCountRes.count

  const revenueThisMonth = (paymentsThisMonth ?? []).reduce((s, r) => s + Number(r.amount), 0)
  const revenueLastMonth = (paymentsLastMonth ?? []).reduce((s, r) => s + Number(r.amount), 0)
  const pendingAmount = (pendingPayments ?? []).reduce((s, r) => s + Number(r.amount), 0)
  const clients = ownerCount ?? 0
  const avgClientValue = clients > 0 ? revenueThisMonth / clients : 0
  const changePct =
    revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) : 0

  return {
    data: [
      { label: 'Total Revenue', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(revenueThisMonth), change: changePct !== 0 ? `${changePct > 0 ? '+' : ''}${changePct}% vs last month` : '—', iconKey: 'DollarSign', color: 'bg-green-500/20 text-green-400' },
      { label: 'Monthly Recurring', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(revenueThisMonth), change: 'From gym subscriptions', iconKey: 'TrendingUp', color: 'bg-blue-500/20 text-blue-400' },
      { label: 'Avg. Client Value', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(avgClientValue), change: 'Per gym client', iconKey: 'Target', color: 'bg-purple-500/20 text-purple-400' },
      { label: 'Pending Payments', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pendingAmount), change: 'Awaiting settlement', iconKey: 'Calendar', color: 'bg-orange-500/20 text-orange-400' },
    ],
    error: null,
  }
}

export type GetAdminPlatformRevenueChartResult = { data: AdminRevenueChartPoint[]; error: null } | { data: AdminRevenueChartPoint[]; error: string }

export async function getAdminPlatformRevenueChartData(months = 6): Promise<GetAdminPlatformRevenueChartResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: [], error: null }
  const supabase = await createClient()
  const end = new Date()
  const start = new Date(end.getFullYear(), end.getMonth() - months, 1)
  const { data, error } = await supabase
    .from('platform_payments')
    .select('amount, paid_at')
    .eq('status', 'completed')
    .gte('paid_at', start.toISOString())
    .not('paid_at', 'is', null)
  if (error) return { data: [], error: error.message }
  const byMonth: Record<string, number> = {}
  for (let i = 0; i < months; i++) {
    const d = new Date(end.getFullYear(), end.getMonth() - (months - 1 - i), 1)
    byMonth[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 0
  }
  for (const p of data ?? []) {
    const key = (p.paid_at as string).slice(0, 7)
    if (byMonth[key] != null) byMonth[key] += Number(p.amount)
  }
  const result = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, revenue]) => {
      const [, m] = key.split('-').map(Number)
      return { month: MONTH_NAMES[m - 1], revenue }
    })
  return { data: result, error: null }
}

export type AdminPlatformPayment = {
  id: number
  clientName: string
  amount: number
  periodStart: string
  periodEnd: string
  status: string
  paymentDate: string
}

export type GetAdminPlatformPaymentsResult = { data: AdminPlatformPayment[]; error: null } | { data: AdminPlatformPayment[]; error: string }

export async function getAdminPlatformPayments(limit = 50): Promise<GetAdminPlatformPaymentsResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: [], error: null }
  const supabase = await createClient()
  const { data: payments, error } = await supabase
    .from('platform_payments')
    .select('id, amount, period_start, period_end, status, paid_at, user_id')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return { data: [], error: error.message }
  const userIds = [...new Set((payments ?? []).map((p) => (p as { user_id: number }).user_id))]
  const userMap: Record<number, string> = {}
  if (userIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, gym_name, name')
      .in('id', userIds)
    if (usersError) return { data: [], error: usersError.message }
    for (const u of users ?? []) {
      const row = u as { id: number; gym_name: string | null; name: string }
      userMap[row.id] = row.gym_name ?? row.name ?? '—'
    }
  }
  const data = (payments ?? []).map((r: unknown) => {
    const row = r as { id: number; amount: number; period_start: string; period_end: string; status: string; paid_at: string | null; user_id: number }
    return {
      id: row.id,
      clientName: userMap[row.user_id] ?? '—',
      amount: Number(row.amount),
      periodStart: row.period_start ?? '',
      periodEnd: row.period_end ?? '',
      status: row.status ?? 'pending',
      paymentDate: row.paid_at ?? '',
    }
  })
  return { data, error: null }
}

// --- Platform Plans ---

export type PlatformPlan = {
  id: number
  name: string
  price_monthly: number
  min_active_users: number
  max_active_users: number | null
  overage_price_per_user: number | null
  is_active: boolean
  sort_order: number
}

export type GetPlatformPlansResult = { data: PlatformPlan[]; error: null } | { data: PlatformPlan[]; error: string }

export async function getPlatformPlans(): Promise<GetPlatformPlansResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('platform_plans')
    .select('id, name, price_monthly, min_active_users, max_active_users, overage_price_per_user, is_active, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) return { data: [], error: error.message }
  const plans = (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    price_monthly: Number(r.price_monthly),
    min_active_users: r.min_active_users ?? 0,
    max_active_users: r.max_active_users ?? null,
    overage_price_per_user: r.overage_price_per_user != null ? Number(r.overage_price_per_user) : null,
    is_active: r.is_active ?? true,
    sort_order: r.sort_order ?? 0,
  }))
  return { data: plans, error: null }
}

// Create / update platform payments (gym → platform) and activate gym owners

export type CreatePlatformPaymentInput = {
  userId: number
  amount: number
  periodStart: string
  periodEnd: string
  status?: 'pending' | 'completed' | 'failed'
  planId?: number
  subscriptionId?: number
  paymentMethod?: 'cash' | 'card' | 'bank_transfer'
}

export type CreatePlatformPaymentResult =
  | { ok: true; message: string }
  | { ok: false; error: string }

export async function createPlatformPayment(
  input: CreatePlatformPaymentInput
): Promise<CreatePlatformPaymentResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { ok: false, error: 'Not authorized' }

  const supabase = await createClient()
  const status = input.status ?? 'pending'

  let resolvedSubscriptionId = input.subscriptionId ?? null

  if (status === 'completed' && input.planId) {
    if (input.subscriptionId) {
      // Renewal: extend current_period_end
      await supabase.from('platform_subscriptions').update({
        current_period_start: input.periodStart,
        current_period_end: input.periodEnd,
        updated_at: new Date().toISOString(),
      }).eq('id', input.subscriptionId)
    } else {
      // First activation: create new subscription
      const { data: newSub } = await supabase.from('platform_subscriptions').insert({
        user_id: input.userId,
        platform_plan_id: input.planId,
        status: 'active',
        current_period_start: input.periodStart,
        current_period_end: input.periodEnd,
        started_at: new Date().toISOString(),
      }).select('id').single()
      if (newSub) resolvedSubscriptionId = (newSub as { id: number }).id
    }
    await supabase.from('users').update({ is_active: true }).eq('id', input.userId)
  }

  const { error } = await supabase.from('platform_payments').insert({
    user_id: input.userId,
    amount: input.amount,
    period_start: input.periodStart,
    period_end: input.periodEnd,
    status,
    paid_at: status === 'completed' ? new Date().toISOString() : null,
    ...(resolvedSubscriptionId ? { subscription_id: resolvedSubscriptionId } : {}),
    ...(input.paymentMethod ? { payment_method: input.paymentMethod } : {}),
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin/accounting')
  revalidatePath('/admin/clients')

  return { ok: true, message: 'Platform payment recorded.' }
}

export type UpdatePlatformPaymentStatusInput = {
  id: number
  status: 'pending' | 'completed' | 'failed'
}

export type UpdatePlatformPaymentStatusResult =
  | { ok: true; message: string }
  | { ok: false; error: string }

export async function updatePlatformPaymentStatus(
  input: UpdatePlatformPaymentStatusInput
): Promise<UpdatePlatformPaymentStatusResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { ok: false, error: 'Not authorized' }

  const supabase = await createClient()

  const { data: payment, error: fetchError } = await supabase
    .from('platform_payments')
    .select('user_id')
    .eq('id', input.id)
    .maybeSingle()

  if (fetchError) return { ok: false, error: fetchError.message }
  if (!payment) return { ok: false, error: 'Payment not found' }

  const { error } = await supabase
    .from('platform_payments')
    .update({
      status: input.status,
      paid_at: input.status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', input.id)

  if (error) return { ok: false, error: error.message }

  if (input.status === 'completed') {
    const userId = (payment as { user_id: number }).user_id
    await supabase
      .from('users')
      .update({ is_active: true })
      .eq('id', userId)
  }

  revalidatePath('/admin/accounting')
  revalidatePath('/admin/clients')

  return { ok: true, message: 'Platform payment updated.' }
}

// --- Update Admin Client ---

export type UpdateAdminClientInput = {
  id: number
  name: string
  email: string
  phone: string | null
  status: 'active' | 'inactive' | 'suspended'
}

export type UpdateAdminClientResult =
  | { ok: true; message: string }
  | { ok: false; error: string }

export async function updateAdminClient(
  input: UpdateAdminClientInput
): Promise<UpdateAdminClientResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { ok: false, error: 'Not authorized' }

  const supabase = await createClient()

  const isActive = input.status === 'active'

  const { error } = await supabase
    .from('users')
    .update({
      gym_name: input.name,
      email: input.email,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin/clients')

  return { ok: true, message: 'Client updated successfully.' }
}

// --- Admin Analytics ---

export type UserGrowthPoint = {
  month: string
  newUsers: number
  newAffiliados: number
}

export type GetAdminUserGrowthResult = { data: UserGrowthPoint[]; error: null } | { data: UserGrowthPoint[]; error: string }

export async function getAdminUserGrowthData(months = 6): Promise<GetAdminUserGrowthResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: [], error: null }
  const supabase = await createClient()
  const end = new Date()
  const start = new Date(end.getFullYear(), end.getMonth() - months, 1)
  const [newOwnersRes, newMembersRes] = await Promise.all([
    supabase.from('users').select('created_at').eq('role', 'owner').gte('created_at', start.toISOString()),
    supabase.from('members').select('created_at').gte('created_at', start.toISOString()),
  ])
  if (newOwnersRes.error || newMembersRes.error) return { data: [], error: (newOwnersRes.error || newMembersRes.error)?.message ?? 'Failed to load growth data' }
  const newOwners = newOwnersRes.data
  const newMembers = newMembersRes.data
  const byMonth: Record<string, { newUsers: number; newAffiliados: number }> = {}
  for (let i = 0; i < months; i++) {
    const d = new Date(end.getFullYear(), end.getMonth() - (months - 1 - i), 1)
    byMonth[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = { newUsers: 0, newAffiliados: 0 }
  }
  for (const u of newOwners ?? []) {
    const key = (u.created_at as string).slice(0, 7)
    if (byMonth[key]) byMonth[key].newUsers += 1
  }
  for (const m of newMembers ?? []) {
    const key = (m.created_at as string).slice(0, 7)
    if (byMonth[key]) byMonth[key].newAffiliados += 1
  }
  const data = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => {
      const [, monthNum] = key.split('-').map(Number)
      return { month: MONTH_NAMES[monthNum - 1], newUsers: v.newUsers, newAffiliados: v.newAffiliados }
    })
  return { data, error: null }
}

export type GrowthMetric = {
  label: string
  value: string
  iconKey: string
  color: string
  description: string
}

const emptyAdminGrowthMetrics: GrowthMetric[] = [
  { label: 'Monthly Growth', value: '—', iconKey: 'TrendingUp', color: 'bg-green-500/20 text-green-400', description: 'New gym owners vs last month' },
  { label: 'Retention Rate', value: '—', iconKey: 'Users', color: 'bg-blue-500/20 text-blue-400', description: 'Active returning users' },
  { label: 'Total Clients', value: '0', iconKey: 'Calendar', color: 'bg-purple-500/20 text-purple-400', description: 'Gym owners' },
  { label: 'Active Members', value: '0', iconKey: 'AlertCircle', color: 'bg-orange-500/20 text-orange-400', description: 'Total Affiliados (across gyms)' },
]

export type GetAdminGrowthMetricsResult = { data: GrowthMetric[]; error: null } | { data: GrowthMetric[]; error: string }

export async function getAdminGrowthMetrics(): Promise<GetAdminGrowthMetricsResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { data: emptyAdminGrowthMetrics, error: null }
  const supabase = await createClient()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const [newThisMonthRes, newLastMonthRes, totalOwnersRes, activeMembersRes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'owner').gte('created_at', monthStart),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'owner').gte('created_at', lastMonthStart).lt('created_at', monthStart),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'owner'),
    supabase.from('members').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ])
  const err = newThisMonthRes.error || newLastMonthRes.error || totalOwnersRes.error || activeMembersRes.error
  if (err) return { data: emptyAdminGrowthMetrics, error: err.message }
  const newThisMonth = newThisMonthRes.count
  const newLastMonth = newLastMonthRes.count
  const totalOwners = totalOwnersRes.count
  const activeMembers = activeMembersRes.count
  const growthPct =
    (newLastMonth ?? 0) > 0 ? `+${Math.round(((newThisMonth ?? 0) - (newLastMonth ?? 0)) / (newLastMonth ?? 0) * 100)}%` : '—'
  return {
    data: [
      { label: 'Monthly Growth', value: growthPct, iconKey: 'TrendingUp', color: 'bg-green-500/20 text-green-400', description: 'New gym owners vs last month' },
      { label: 'Retention Rate', value: '—', iconKey: 'Users', color: 'bg-blue-500/20 text-blue-400', description: 'Active returning users' },
      { label: 'Total Clients', value: String(totalOwners ?? 0), iconKey: 'Calendar', color: 'bg-purple-500/20 text-purple-400', description: 'Gym owners' },
      { label: 'Active Members', value: new Intl.NumberFormat('en-US').format(activeMembers ?? 0), iconKey: 'AlertCircle', color: 'bg-orange-500/20 text-orange-400', description: 'Total Affiliados (across gyms)' },
    ],
    error: null,
  }
}

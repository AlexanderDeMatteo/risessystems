'use server'

import { createClient } from '@/lib/supabase/server'
import { isCurrentUserAdmin } from '@/app/actions/admin'
import type { NotificationItem } from '@/lib/types/notifications'

export async function getAdminNotifications(limit = 20): Promise<NotificationItem[]> {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) return []

  const supabase = await createClient()

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const todayISO = now.toISOString().slice(0, 10)
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const weekFromNowEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    newGymsRes,
    platformPaymentsRes,
    pendingPaymentsRes,
    expiringSubscriptionsRes,
    activeVersusRes,
    versusEndingRes,
  ] = await Promise.all([
    supabase
      .from('users')
      .select('id, email, gym_name, created_at')
      .eq('role', 'owner')
      .gte('created_at', weekAgo)
      .order('created_at', { ascending: false })
      .limit(10),

    supabase
      .from('platform_payments')
      .select('id, amount, paid_at, users!platform_payments_user_id_fkey(gym_name, email)')
      .eq('status', 'completed')
      .order('paid_at', { ascending: false })
      .limit(5),

    supabase
      .from('platform_payments')
      .select('id, amount, user_id, users!platform_payments_user_id_fkey(gym_name, email)')
      .eq('status', 'pending'),

    supabase
      .from('platform_subscriptions')
      .select(`
        id,
        user_id,
        started_at,
        platform_plans!platform_subscriptions_platform_plan_id_fkey(name, billing_cycle),
        users!platform_subscriptions_user_id_fkey(gym_name, email)
      `)
      .eq('status', 'active'),

    supabase
      .from('competitions')
      .select('id', { count: 'exact', head: true })
      .eq('scope', 'versus')
      .eq('status', 'active'),

    supabase
      .from('competitions')
      .select('id, title, ends_at')
      .eq('scope', 'versus')
      .eq('status', 'active')
      .lte('ends_at', weekFromNowEnd)
      .gte('ends_at', now.toISOString())
      .order('ends_at', { ascending: true })
      .limit(10),
  ])

  const items: NotificationItem[] = []

  for (const row of (newGymsRes.data ?? []) as {
    id: number
    email: string
    gym_name: string | null
    created_at: string
  }[]) {
    const name = row.gym_name || row.email || 'Unknown'
    items.push({
      id: `new-gym-${row.id}`,
      type: 'new_gym',
      title: 'New gym registered',
      description: name,
      timestamp: row.created_at,
      href: '/admin/clients',
    })
  }

  for (const row of (platformPaymentsRes.data ?? []) as {
    id: number
    amount: number
    paid_at: string
    users: { gym_name: string | null; email: string } | { gym_name: string | null; email: string }[] | null
  }[]) {
    const user = row.users
      ? Array.isArray(row.users) ? row.users[0] : row.users
      : null
    const name = user?.gym_name || user?.email || 'Unknown'
    items.push({
      id: `platform-payment-${row.id}`,
      type: 'platform_payment',
      title: 'Platform payment received',
      description: `$${Number(row.amount).toFixed(2)} - ${name}`,
      timestamp: row.paid_at,
      href: '/admin/accounting',
    })
  }

  const pendingRows = (pendingPaymentsRes.data ?? []) as {
    id: number
    amount: number
    user_id: number
    users: { gym_name: string | null; email: string } | { gym_name: string | null; email: string }[] | null
  }[]
  if (pendingRows.length > 0) {
    const totalPending = pendingRows.reduce((sum, r) => sum + Number(r.amount), 0)
    items.push({
      id: 'platform-payment-pending-summary',
      type: 'platform_payment_pending',
      title: 'Pending platform payments',
      description: `${pendingRows.length} payment${pendingRows.length > 1 ? 's' : ''} ($${totalPending.toFixed(2)}) awaiting collection`,
      timestamp: now.toISOString(),
      href: '/admin/accounting',
    })
  }

  const activeVersusCount = activeVersusRes.count ?? 0
  if (activeVersusCount > 0) {
    items.push({
      id: 'versus-active-summary',
      type: 'competitions_active_summary',
      title: 'Active versus competitions',
      description: `${activeVersusCount} competition${activeVersusCount > 1 ? 's' : ''} running`,
      timestamp: now.toISOString(),
      href: '/admin/competitions',
    })
  }

  for (const row of (versusEndingRes.data ?? []) as { id: number; title: string; ends_at: string }[]) {
    items.push({
      id: `versus-ending-${row.id}`,
      type: 'competition_ending_soon',
      title: 'Versus ending soon',
      description: `${row.title} — ends ${row.ends_at.slice(0, 10)}`,
      timestamp: row.ends_at,
      href: `/admin/competitions/${row.id}`,
    })
  }

  for (const row of (expiringSubscriptionsRes.data ?? []) as {
    id: number
    user_id: number
    started_at: string
    platform_plans: { name: string; billing_cycle: string } | { name: string; billing_cycle: string }[] | null
    users: { gym_name: string | null; email: string } | { gym_name: string | null; email: string }[] | null
  }[]) {
    const plan = row.platform_plans
      ? Array.isArray(row.platform_plans) ? row.platform_plans[0] : row.platform_plans
      : null
    const user = row.users
      ? Array.isArray(row.users) ? row.users[0] : row.users
      : null

    if (!plan) continue

    const startDate = new Date(row.started_at)
    let expiryDate: Date
    if (plan.billing_cycle === 'yearly') {
      expiryDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000)
    } else {
      expiryDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    }

    const expiryISO = expiryDate.toISOString().slice(0, 10)

    if (expiryISO >= todayISO && expiryISO <= weekFromNow) {
      const name = user?.gym_name || user?.email || 'Unknown'
      items.push({
        id: `subscription-expiring-${row.id}`,
        type: 'subscription_expiring',
        title: 'Subscription expiring soon',
        description: `${name} - ${plan.name} (${expiryISO})`,
        timestamp: expiryDate.toISOString(),
        href: '/admin/clients',
      })
    }
  }

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return items.slice(0, limit)
}

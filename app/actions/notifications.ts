'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import type { NotificationItem } from '@/lib/types/notifications'

type NotificationPrefs = {
  notifyExpiring: boolean
  notifyPayments: boolean
  notifyCheckins: boolean
  notifyNewMembers: boolean
}

async function getNotificationPrefs(userId: number): Promise<NotificationPrefs> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_settings')
    .select('notify_expiring, notify_payments, notify_checkins, notify_new_members')
    .eq('user_id', userId)
    .maybeSingle()

  if (!data) {
    return { notifyExpiring: true, notifyPayments: true, notifyCheckins: true, notifyNewMembers: true }
  }

  return {
    notifyExpiring: data.notify_expiring ?? true,
    notifyPayments: data.notify_payments ?? true,
    notifyCheckins: data.notify_checkins ?? true,
    notifyNewMembers: data.notify_new_members ?? true,
  }
}

export async function getNotifications(limit = 20): Promise<NotificationItem[]> {
  const userId = await getCurrentAppUserId()
  if (!userId) return []

  const supabase = await createClient()
  const prefs = await getNotificationPrefs(userId)

  const now = new Date()
  const todayISO = now.toISOString().slice(0, 10)
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  const queries: PromiseLike<{ data: unknown[] | null }>[] = []
  const queryKeys: string[] = []

  if (prefs.notifyExpiring) {
    queries.push(
      supabase
        .from('members')
        .select('id, first_name, last_name, expiry_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('expiry_date', todayISO)
        .lte('expiry_date', weekFromNow)
        .order('expiry_date', { ascending: true })
        .limit(10)
    )
    queryKeys.push('expiring')

    queries.push(
      supabase
        .from('members')
        .select('id, first_name, last_name, expiry_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .lt('expiry_date', todayISO)
        .order('expiry_date', { ascending: false })
        .limit(10)
    )
    queryKeys.push('expired')
  }

  if (prefs.notifyPayments) {
    queries.push(
      supabase
        .from('payments')
        .select('id, amount, paid_at, members!payments_member_id_fkey(first_name, last_name)')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('paid_at', { ascending: false })
        .limit(5)
    )
    queryKeys.push('payments')

    queries.push(
      supabase
        .from('payments')
        .select('id, amount')
        .eq('user_id', userId)
        .eq('status', 'pending')
    )
    queryKeys.push('pending')
  }

  if (prefs.notifyCheckins) {
    queries.push(
      supabase
        .from('check_ins')
        .select('id, check_in_time, members!inner(first_name, last_name, user_id)')
        .eq('members.user_id', userId)
        .gte('check_in_time', todayStart)
        .order('check_in_time', { ascending: false })
        .limit(5)
    )
    queryKeys.push('checkins')
  }

  if (prefs.notifyNewMembers) {
    queries.push(
      supabase
        .from('members')
        .select('id, first_name, last_name, membership_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', weekAgo)
        .order('created_at', { ascending: false })
        .limit(5)
    )
    queryKeys.push('newMembers')
  }

  queries.push(
    supabase
      .from('competition_gyms')
      .select(
        `
        competition_id,
        competitions!inner(id, title, status, scope, ends_at)
      `
      )
      .eq('user_id', userId)
      .eq('competitions.scope', 'versus')
      .in('competitions.status', ['active', 'completed'])
      .limit(15)
  )
  queryKeys.push('competitions')

  const results = await Promise.all(queries)
  const resultMap: Record<string, unknown[] | null> = {}
  queryKeys.forEach((key, i) => {
    resultMap[key] = results[i].data
  })

  const items: NotificationItem[] = []

  for (const row of (resultMap.expiring ?? []) as { id: number; first_name: string; last_name: string; expiry_date: string }[]) {
    const name = [row.first_name, row.last_name].filter(Boolean).join(' ').trim() || 'Unknown'
    items.push({
      id: `expiring-${row.id}`,
      type: 'expiring',
      title: 'Membership expiring soon',
      description: `${name} expires ${row.expiry_date}`,
      timestamp: new Date(row.expiry_date).toISOString(),
      href: '/dashboard/members',
    })
  }

  for (const row of (resultMap.expired ?? []) as { id: number; first_name: string; last_name: string; expiry_date: string }[]) {
    const name = [row.first_name, row.last_name].filter(Boolean).join(' ').trim() || 'Unknown'
    items.push({
      id: `expired-${row.id}`,
      type: 'expired',
      title: 'Membership expired',
      description: `${name} expired ${row.expiry_date}`,
      timestamp: new Date(row.expiry_date).toISOString(),
      href: '/dashboard/members',
    })
  }

  for (const row of (resultMap.payments ?? []) as {
    id: number
    amount: number
    paid_at: string
    members: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null
  }[]) {
    const member = row.members
      ? Array.isArray(row.members) ? row.members[0] : row.members
      : null
    const name = member
      ? [member.first_name, member.last_name].filter(Boolean).join(' ').trim() || 'Unknown'
      : 'Unknown'
    items.push({
      id: `payment-${row.id}`,
      type: 'payment',
      title: 'Payment received',
      description: `$${Number(row.amount).toFixed(2)} - ${name}`,
      timestamp: row.paid_at,
      href: '/dashboard/accounting',
    })
  }

  const pendingRows = (resultMap.pending ?? []) as { id: number; amount: number }[]
  if (pendingRows.length > 0) {
    const totalPending = pendingRows.reduce((sum, r) => sum + Number(r.amount), 0)
    items.push({
      id: 'payment-pending-summary',
      type: 'payment_pending',
      title: 'Pending payments',
      description: `${pendingRows.length} payment${pendingRows.length > 1 ? 's' : ''} ($${totalPending.toFixed(2)}) awaiting collection`,
      timestamp: now.toISOString(),
      href: '/dashboard/accounting',
    })
  }

  for (const row of (resultMap.checkins ?? []) as {
    id: number
    check_in_time: string
    members: { first_name: string; last_name: string } | { first_name: string; last_name: string }[]
  }[]) {
    const member = Array.isArray(row.members) ? row.members[0] : row.members
    const name = member
      ? [member.first_name, member.last_name].filter(Boolean).join(' ').trim() || 'Unknown'
      : 'Unknown'
    items.push({
      id: `checkin-${row.id}`,
      type: 'checkin',
      title: 'Member check-in',
      description: name,
      timestamp: row.check_in_time,
      href: '/dashboard/qr-scanner',
    })
  }

  for (const row of (resultMap.newMembers ?? []) as { id: number; first_name: string; last_name: string; membership_type: string; created_at: string }[]) {
    const name = [row.first_name, row.last_name].filter(Boolean).join(' ').trim() || 'Unknown'
    items.push({
      id: `new-member-${row.id}`,
      type: 'new_member',
      title: 'New member registered',
      description: `${name} - ${row.membership_type}`,
      timestamp: row.created_at,
      href: '/dashboard/members',
    })
  }

  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()
  for (const row of (resultMap.competitions ?? []) as {
    competition_id: number
    competitions:
      | { id: number; title: string; status: string; scope: string; ends_at: string }
      | { id: number; title: string; status: string; scope: string; ends_at: string }[]
  }[]) {
    const comp = Array.isArray(row.competitions) ? row.competitions[0] : row.competitions
    if (!comp) continue
    if (comp.status === 'active') {
      items.push({
        id: `versus-active-${comp.id}`,
        type: 'competition_assigned',
        title: 'Versus competition active',
        description: comp.title,
        timestamp: now.toISOString(),
        href: `/dashboard/competitions/${comp.id}`,
      })
    } else if (comp.status === 'completed' && comp.ends_at >= sixtyDaysAgo) {
      items.push({
        id: `versus-done-${comp.id}`,
        type: 'competition_finished',
        title: 'Versus competition finished',
        description: comp.title,
        timestamp: comp.ends_at,
        href: `/dashboard/competitions/${comp.id}`,
      })
    }
  }

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return items.slice(0, limit)
}

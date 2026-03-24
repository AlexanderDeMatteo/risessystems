import { supabase } from '@/lib/supabase'

export type OwnerKpis = {
  memberCount: number
  checkInsToday: number
  revenueThisMonth: number
}

export async function fetchOwnerKpis(): Promise<{ data: OwnerKpis | null; error: string | null }> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const startIso = startOfMonth.toISOString()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayIso = today.toISOString()

  const [{ count: memberCount, error: e1 }, { count: checkInsToday, error: e2 }, { data: payments, error: e3 }] =
    await Promise.all([
      supabase.from('members').select('id', { count: 'exact', head: true }),
      supabase
        .from('check_ins')
        .select('id', { count: 'exact', head: true })
        .gte('check_in_time', todayIso),
      supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('paid_at', startIso),
    ])

  if (e1) return { data: null, error: e1.message }
  if (e2) return { data: null, error: e2.message }
  if (e3) return { data: null, error: e3.message }

  const revenueThisMonth = (payments ?? []).reduce((sum, row) => sum + Number((row as { amount: string }).amount), 0)

  return {
    data: {
      memberCount: memberCount ?? 0,
      checkInsToday: checkInsToday ?? 0,
      revenueThisMonth,
    },
    error: null,
  }
}

export type AdminKpis = {
  gymCount: number
  memberCount: number
  revenueSample: number
}

export async function fetchAdminKpis(): Promise<{ data: AdminKpis | null; error: string | null }> {
  const [{ count: gymCount, error: e1 }, { count: memberCount, error: e2 }] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'owner'),
    supabase.from('members').select('id', { count: 'exact', head: true }),
  ])

  if (e1) return { data: null, error: e1.message }
  if (e2) return { data: null, error: e2.message }

  return {
    data: {
      gymCount: gymCount ?? 0,
      memberCount: memberCount ?? 0,
      revenueSample: 0,
    },
    error: null,
  }
}

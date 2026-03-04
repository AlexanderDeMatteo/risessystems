'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { revalidatePath } from 'next/cache'

export type PaymentRow = {
  id: number
  name: string
  amount: number
  payment_method: string
  payment_type: string
  status: string
  payment_date: string
}

export type GetPaymentsResult =
  | { payments: PaymentRow[]; error: null }
  | { payments: PaymentRow[]; error: string }

export async function getPayments(limit = 50): Promise<GetPaymentsResult> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { payments: [], error: 'Not authenticated' }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      payment_method,
      payment_type,
      status,
      paid_at,
      members!payments_member_id_fkey(first_name, last_name)
    `)
    .eq('user_id', userId)
    .order('paid_at', { ascending: false })
    .limit(limit)
  if (error) return { payments: [], error: error.message }
  const payments = (data ?? []).map((r: unknown) => {
    const row = r as {
      id: number
      amount: number
      payment_method: string
      payment_type: string
      status: string
      paid_at: string
      members: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null
    }
    const member = row.members
      ? Array.isArray(row.members)
        ? row.members[0]
        : row.members
      : null
    const name = member
      ? [member.first_name, member.last_name].filter(Boolean).join(' ').trim() || 'Unknown'
      : '—'
    return {
      id: row.id,
      name,
      amount: Number(row.amount),
      payment_method: row.payment_method ?? 'cash',
      payment_type: row.payment_type ?? 'other',
      status: row.status ?? 'completed',
      payment_date: row.paid_at ?? new Date().toISOString(),
    }
  })
  return { payments, error: null }
}

export type AccountingStats = {
  totalRevenueThisMonth: number
  totalRevenueLastMonth: number
  revenueChangePercent: number
  membershipFeesThisMonth: number
  personalTrainingThisMonth: number
  personalTrainingCountThisWeek: number
  pendingCount: number
  pendingAmount: number
  paymentMethodBreakdown: { cash: number; card: number; bank_transfer: number }
}

const emptyStats: AccountingStats = {
  totalRevenueThisMonth: 0,
  totalRevenueLastMonth: 0,
  revenueChangePercent: 0,
  membershipFeesThisMonth: 0,
  personalTrainingThisMonth: 0,
  personalTrainingCountThisWeek: 0,
  pendingCount: 0,
  pendingAmount: 0,
  paymentMethodBreakdown: { cash: 0, card: 0, bank_transfer: 0 },
}

export type GetAccountingStatsResult = { stats: AccountingStats; error: null } | { stats: AccountingStats; error: string }

export async function getAccountingStats(): Promise<GetAccountingStatsResult> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { stats: emptyStats, error: null }
  const supabase = await createClient()
  const now = new Date()
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  const { data: rows, error } = await supabase
    .from('payments')
    .select('amount, payment_type, payment_method, status, paid_at')
    .eq('user_id', userId)
    .gte('paid_at', threeMonthsAgo.toISOString())
  if (error) return { stats: emptyStats, error: error.message }
  const payments = (rows ?? []) as { amount: number; payment_type: string; payment_method: string; status: string; paid_at: string }[]

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  let totalRevenueThisMonth = 0
  let totalRevenueLastMonth = 0
  let membershipFeesThisMonth = 0
  let personalTrainingThisMonth = 0
  let personalTrainingCountThisWeek = 0
  let pendingCount = 0
  let pendingAmount = 0
  const breakdown = { cash: 0, card: 0, bank_transfer: 0 }

  for (const p of payments) {
    const amount = Number(p.amount)
    const paidAt = p.paid_at ? new Date(p.paid_at) : null
    const completed = (p.status ?? 'completed') === 'completed'

    if (paidAt && paidAt >= thisMonthStart && paidAt <= thisMonthEnd) {
      if (completed) {
        totalRevenueThisMonth += amount
        if (p.payment_type === 'membership') membershipFeesThisMonth += amount
        if (p.payment_type === 'personal_training') {
          personalTrainingThisMonth += amount
          if (paidAt >= weekAgo) personalTrainingCountThisWeek += 1
        }
        const method = (p.payment_method ?? 'cash').toLowerCase().replace(/\s/g, '_')
        if (method === 'bank_transfer') breakdown.bank_transfer += amount
        else if (method === 'card') breakdown.card += amount
        else breakdown.cash += amount
      }
    }
    if (paidAt && paidAt >= lastMonthStart && paidAt <= lastMonthEnd && completed) {
      totalRevenueLastMonth += amount
    }
    if (!completed) {
      pendingCount += 1
      pendingAmount += amount
    }
  }

  const revenueChangePercent =
    totalRevenueLastMonth > 0
      ? Math.round(((totalRevenueThisMonth - totalRevenueLastMonth) / totalRevenueLastMonth) * 100)
      : 0

  return {
    stats: {
      totalRevenueThisMonth,
      totalRevenueLastMonth,
      revenueChangePercent,
      membershipFeesThisMonth,
      personalTrainingThisMonth,
      personalTrainingCountThisWeek,
      pendingCount,
      pendingAmount,
      paymentMethodBreakdown: breakdown,
    },
    error: null,
  }
}

export type MemberStatusUpdate = {
  status?: 'active' | 'inactive' | 'suspended'
  new_expiry_date?: string // ISO YYYY-MM-DD
}

export type CreatePaymentInput = {
  member_id: number
  amount: number
  payment_type: 'membership' | 'personal_training' | 'other'
  payment_method: 'cash' | 'card' | 'bank_transfer'
  description?: string
  update_member?: MemberStatusUpdate
}

export async function createPayment(
  input: CreatePaymentInput
): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      member_id: input.member_id,
      amount: input.amount,
      payment_type: input.payment_type,
      payment_method: input.payment_method,
      description: input.description ?? null,
      status: 'completed',
    })
    .select('id')
    .single()
  if (error) return { ok: false, error: error.message }

  if (input.update_member) {
    const patch: Record<string, unknown> = {}
    if (input.update_member.status) patch.status = input.update_member.status
    if (input.update_member.new_expiry_date) patch.expiry_date = input.update_member.new_expiry_date
    if (Object.keys(patch).length > 0) {
      await supabase.from('members').update(patch).eq('id', input.member_id).eq('user_id', userId)
    }
  }

  revalidatePath('/dashboard/accounting')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/members')
  return { ok: true, id: data.id }
}

export type UpdatePaymentInput = {
  amount?: number
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method?: 'cash' | 'card' | 'bank_transfer'
  description?: string | null
}

export async function updatePayment(
  id: number,
  input: UpdatePaymentInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const payload: Record<string, unknown> = {}
  if (input.amount !== undefined) payload.amount = input.amount
  if (input.status !== undefined) payload.status = input.status
  if (input.payment_method !== undefined) payload.payment_method = input.payment_method
  if (input.description !== undefined) payload.description = input.description ?? null
  if (Object.keys(payload).length === 0) return { ok: true }
  const { error } = await supabase.from('payments').update(payload).eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/accounting')
  revalidatePath('/dashboard')
  return { ok: true }
}

export async function deletePayment(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { error } = await supabase.from('payments').delete().eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/accounting')
  revalidatePath('/dashboard')
  return { ok: true }
}

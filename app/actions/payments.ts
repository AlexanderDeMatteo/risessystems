'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { revalidatePath } from 'next/cache'

export type PaymentRow = {
  id: number
  name: string
  amount: number
  payment_method: string
  status: string
  payment_date: string
}

export async function getPayments(limit = 50): Promise<PaymentRow[]> {
  const userId = await getCurrentAppUserId()
  if (!userId) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      payment_method,
      status,
      paid_at,
      members!payments_member_id_fkey(first_name, last_name)
    `)
    .eq('user_id', userId)
    .order('paid_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return (data ?? []).map((r: unknown) => {
    const row = r as {
      id: number
      amount: number
      payment_method: string
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
      status: row.status ?? 'completed',
      payment_date: row.paid_at ?? new Date().toISOString(),
    }
  })
}

export type CreatePaymentInput = {
  member_id: number
  amount: number
  payment_type: 'membership' | 'personal_training' | 'other'
  payment_method: 'cash' | 'card' | 'bank_transfer'
  description?: string
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
  revalidatePath('/dashboard/accounting')
  revalidatePath('/dashboard')
  return { ok: true, id: data.id }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { revalidatePath } from 'next/cache'

export type PlanRow = {
  id: number
  name: string
  description: string | null
  price: number
  duration_days: number
  is_active: boolean
}

export async function getMembershipPlans(): Promise<PlanRow[]> {
  const userId = await getCurrentAppUserId()
  if (!userId) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('membership_plans')
    .select('id, name, description, price, duration_days, is_active')
    .eq('user_id', userId)
    .order('id', { ascending: true })
  if (error) return []
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    price: Number(r.price),
    duration_days: r.duration_days,
    is_active: r.is_active ?? true,
  }))
}

export type CreatePlanInput = {
  name: string
  description?: string
  price: number
  duration_days: number
}

export async function createPlan(input: CreatePlanInput): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('membership_plans')
    .insert({
      user_id: userId,
      name: input.name,
      description: input.description || null,
      price: input.price,
      duration_days: input.duration_days,
      is_active: true,
    })
    .select('id')
    .single()
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/plans')
  return { ok: true, id: data.id }
}

export async function updatePlan(id: number, input: Partial<CreatePlanInput>): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const payload: Record<string, unknown> = {}
  if (input.name !== undefined) payload.name = input.name
  if (input.description !== undefined) payload.description = input.description || null
  if (input.price !== undefined) payload.price = input.price
  if (input.duration_days !== undefined) payload.duration_days = input.duration_days
  const { error } = await supabase.from('membership_plans').update(payload).eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/plans')
  return { ok: true }
}

export async function deletePlan(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { error } = await supabase.from('membership_plans').delete().eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/plans')
  return { ok: true }
}

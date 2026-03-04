'use server'

import { createClient } from '@/lib/supabase/server'
import { isCurrentUserAdmin } from '@/app/actions/admin'
import { revalidatePath } from 'next/cache'
import type { PlatformPlan } from '@/lib/types/platform-plans'

export type GetPlatformPlansResult =
  | { plans: PlatformPlan[]; error: null }
  | { plans: PlatformPlan[]; error: string }

export async function getPlatformPlans(): Promise<GetPlatformPlansResult> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { plans: [], error: null }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('platform_plans')
    .select('id, name, min_active_users, max_active_users, price_monthly, is_active, sort_order, overage_threshold, overage_price_per_user')
    .order('sort_order', { ascending: true })
  if (error) return { plans: [], error: error.message }
  const plans = (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    min_active_users: Number(r.min_active_users),
    max_active_users: r.max_active_users != null ? Number(r.max_active_users) : null,
    price_monthly: Number(r.price_monthly),
    is_active: r.is_active ?? true,
    sort_order: Number(r.sort_order),
    overage_threshold: r.overage_threshold != null ? Number(r.overage_threshold) : null,
    overage_price_per_user: r.overage_price_per_user != null ? Number(r.overage_price_per_user) : undefined,
  }))
  return { plans, error: null }
}

/** Non-admin can read active plans (for dashboard subscription display). */
export async function getPlatformPlansPublic(): Promise<GetPlatformPlansResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('platform_plans')
    .select('id, name, min_active_users, max_active_users, price_monthly, is_active, sort_order, overage_threshold, overage_price_per_user')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) return { plans: [], error: error.message }
  const plans = (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    min_active_users: Number(r.min_active_users),
    max_active_users: r.max_active_users != null ? Number(r.max_active_users) : null,
    price_monthly: Number(r.price_monthly),
    is_active: true,
    sort_order: Number(r.sort_order),
    overage_threshold: r.overage_threshold != null ? Number(r.overage_threshold) : null,
    overage_price_per_user: r.overage_price_per_user != null ? Number(r.overage_price_per_user) : undefined,
  }))
  return { plans, error: null }
}

export type CreatePlatformPlanInput = {
  name: string
  min_active_users: number
  max_active_users?: number | null
  price_monthly: number
  is_active?: boolean
  sort_order?: number
  overage_threshold?: number | null
  overage_price_per_user?: number | null
}

export async function createPlatformPlan(
  input: CreatePlatformPlanInput
): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { ok: false, error: 'Not authorized' }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('platform_plans')
    .insert({
      name: input.name,
      min_active_users: input.min_active_users,
      max_active_users: input.max_active_users ?? null,
      price_monthly: input.price_monthly,
      is_active: input.is_active ?? true,
      sort_order: input.sort_order ?? 0,
      overage_threshold: input.overage_threshold ?? null,
      overage_price_per_user: input.overage_price_per_user ?? null,
    })
    .select('id')
    .single()
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/plans')
  return { ok: true, id: data.id }
}

export async function updatePlatformPlan(
  id: number,
  input: Partial<CreatePlatformPlanInput>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { ok: false, error: 'Not authorized' }
  const supabase = await createClient()
  const payload: Record<string, unknown> = {}
  if (input.name !== undefined) payload.name = input.name
  if (input.min_active_users !== undefined) payload.min_active_users = input.min_active_users
  if (input.max_active_users !== undefined) payload.max_active_users = input.max_active_users ?? null
  if (input.price_monthly !== undefined) payload.price_monthly = input.price_monthly
  if (input.is_active !== undefined) payload.is_active = input.is_active
  if (input.sort_order !== undefined) payload.sort_order = input.sort_order
  if (input.overage_threshold !== undefined) payload.overage_threshold = input.overage_threshold ?? null
  if (input.overage_price_per_user !== undefined) payload.overage_price_per_user = input.overage_price_per_user ?? null
  if (Object.keys(payload).length === 0) return { ok: true }
  const { error } = await supabase.from('platform_plans').update(payload).eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/plans')
  return { ok: true }
}

export async function deletePlatformPlan(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await isCurrentUserAdmin()
  if (!admin) return { ok: false, error: 'Not authorized' }
  const supabase = await createClient()
  const { error } = await supabase.from('platform_plans').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/plans')
  return { ok: true }
}

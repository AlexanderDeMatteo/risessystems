'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { revalidatePath } from 'next/cache'

export type BranchRow = {
  id: number
  name: string
  address: string | null
  phone: string | null
  email: string | null
  is_active: boolean
}

export async function getBranches(): Promise<BranchRow[]> {
  const userId = await getCurrentAppUserId()
  if (!userId) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('branches')
    .select('id, name, address, phone, email, is_active')
    .eq('user_id', userId)
    .order('id', { ascending: true })
  if (error) return []
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    address: r.address ?? null,
    phone: r.phone ?? null,
    email: r.email ?? null,
    is_active: r.is_active ?? true,
  }))
}

export type CreateBranchInput = {
  name: string
  address?: string
  phone?: string
  email?: string
}

export async function createBranch(input: CreateBranchInput): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('branches')
    .insert({
      user_id: userId,
      name: input.name,
      address: input.address || null,
      phone: input.phone || null,
      email: input.email || null,
      is_active: true,
    })
    .select('id')
    .single()
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/branches')
  return { ok: true, id: data.id }
}

export async function updateBranch(id: number, input: Partial<CreateBranchInput>): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const payload: Record<string, unknown> = {}
  if (input.name !== undefined) payload.name = input.name
  if (input.address !== undefined) payload.address = input.address || null
  if (input.phone !== undefined) payload.phone = input.phone || null
  if (input.email !== undefined) payload.email = input.email || null
  const { error } = await supabase.from('branches').update(payload).eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/branches')
  return { ok: true }
}

export async function deleteBranch(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { error } = await supabase.from('branches').delete().eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/branches')
  return { ok: true }
}

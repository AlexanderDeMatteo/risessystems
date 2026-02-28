'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { revalidatePath } from 'next/cache'

export type MemberRow = {
  id: number
  name: string
  email: string
  phone: string
  membership_type: string
  status: string
  join_date?: string
  expiry_date?: string
}

export async function getMembers(): Promise<MemberRow[]> {
  const userId = await getCurrentAppUserId()
  if (!userId) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('members')
    .select('id, first_name, last_name, email, phone, membership_type, status, join_date, expiry_date')
    .eq('user_id', userId)
    .order('id', { ascending: true })
  if (error) return []
  return (data ?? []).map((r) => ({
    id: r.id,
    name: [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || 'Unknown',
    email: r.email ?? '',
    phone: r.phone ?? '',
    membership_type: r.membership_type,
    status: r.status,
    join_date: r.join_date,
    expiry_date: r.expiry_date ?? undefined,
  }))
}

export type CreateMemberInput = {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  membership_type: string
  status?: string
  join_date: string
  expiry_date?: string
}

export async function createMember(input: CreateMemberInput): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('members')
    .insert({
      user_id: userId,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email || null,
      phone: input.phone || null,
      membership_type: input.membership_type,
      status: 'active',
      join_date: input.join_date,
      expiry_date: input.expiry_date || null,
    })
    .select('id')
    .single()
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/members')
  return { ok: true, id: data.id }
}

export async function updateMember(id: number, input: Partial<CreateMemberInput>): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const payload: Record<string, unknown> = {}
  if (input.first_name !== undefined) payload.first_name = input.first_name
  if (input.last_name !== undefined) payload.last_name = input.last_name
  if (input.email !== undefined) payload.email = input.email || null
  if (input.phone !== undefined) payload.phone = input.phone || null
  if (input.membership_type !== undefined) payload.membership_type = input.membership_type
  if (input.status !== undefined) payload.status = input.status
  if (input.join_date !== undefined) payload.join_date = input.join_date
  if (input.expiry_date !== undefined) payload.expiry_date = input.expiry_date || null
  const { error } = await supabase.from('members').update(payload).eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/members')
  return { ok: true }
}

export async function deleteMember(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { error } = await supabase.from('members').delete().eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/members')
  return { ok: true }
}

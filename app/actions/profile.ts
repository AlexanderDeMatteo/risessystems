'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { format } from 'date-fns'
import { revalidatePath } from 'next/cache'

export type ProfileUser = {
  name: string
  email: string
  gymName: string | null
  joinDate: string
  phone?: string | null
  location?: string | null
}

export async function getCurrentUserProfile(): Promise<ProfileUser | null> {
  const userId = await getCurrentAppUserId()
  if (!userId) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, gym_name, phone, location, created_at')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return null
  const row = data as { name: string; email: string; gym_name: string | null; phone: string | null; location: string | null; created_at: string }
  return {
    name: row.name ?? '',
    email: row.email ?? '',
    gymName: row.gym_name ?? null,
    joinDate: row.created_at
      ? format(new Date(row.created_at), 'MMMM d, yyyy')
      : '',
    phone: row.phone ?? null,
    location: row.location ?? null,
  }
}

export type UpdateProfileInput = {
  name?: string
  phone?: string | null
  location?: string | null
}

export async function updateUserProfile(input: UpdateProfileInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const payload: Record<string, unknown> = {}
  if (input.name !== undefined) payload.name = input.name
  if (input.phone !== undefined) payload.phone = input.phone || null
  if (input.location !== undefined) payload.location = input.location || null
  if (Object.keys(payload).length === 0) return { ok: true }
  const { error } = await supabase.from('users').update(payload).eq('id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/profile')
  revalidatePath('/admin/profile')
  return { ok: true }
}

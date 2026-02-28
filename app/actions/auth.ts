'use server'

import { createClient } from '@/lib/supabase/server'

export type SignUpResult = { ok: true } | { ok: false; error: string }

export async function createUserProfile(payload: {
  email: string
  name: string
  gym_name: string
}): Promise<SignUpResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Not authenticated' }
  }
  const { error } = await supabase.from('users').insert({
    auth_user_id: user.id,
    email: payload.email,
    name: payload.name,
    gym_name: payload.gym_name || null,
    role: 'owner',
    is_active: true,
  })
  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

/** Ensures current auth user has a row in public.users (e.g. after Google OAuth or email confirm). */
export async function ensureUserProfile(): Promise<SignUpResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Not authenticated' }
  }
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  if (existing) {
    return { ok: true }
  }
  const name =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email?.split('@')[0] ||
    'User'
  const { error } = await supabase.from('users').insert({
    auth_user_id: user.id,
    email: user.email ?? '',
    name,
    gym_name: null,
    role: 'owner',
    is_active: true,
  })
  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

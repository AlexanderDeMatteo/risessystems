'use server'

import { createClient } from '@/lib/supabase/server'
import { getRedirectPathForCurrentUser } from '@/lib/supabase/get-redirect-path'

export type SignUpResult = { ok: true } | { ok: false; error: string }

/** Returns the path to redirect to after login based on the current user's role. */
export async function getRedirectPathAfterLogin(): Promise<'/admin' | '/dashboard' | '/pending-payment'> {
  const supabase = await createClient()
  return getRedirectPathForCurrentUser(supabase)
}

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
    is_active: false,
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
  const gymName = (user.user_metadata?.gym_name as string) || null
  const { error } = await supabase.from('users').insert({
    auth_user_id: user.id,
    email: user.email ?? '',
    name,
    gym_name: gymName,
    role: 'owner',
    is_active: false,
  })
  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

export type UpdatePasswordResult = { ok: true } | { ok: false; error: string }

/** Updates the current user's password. */
export async function updatePassword(newPassword: string): Promise<UpdatePasswordResult> {
  if (!newPassword || newPassword.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' }
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

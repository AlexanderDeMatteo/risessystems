import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns the redirect path for the current authenticated user based on their role.
 * Uses the role from public.users linked via auth_user_id.
 */
export async function getRedirectPathForCurrentUser(
  supabase: SupabaseClient
): Promise<'/admin' | '/dashboard' | '/pending-payment'> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return '/dashboard'

  const { data } = await supabase
    .from('users')
    .select('role, is_active')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  const row = data as { role?: string; is_active?: boolean } | null
  const role = row?.role
  const isActive = row?.is_active

  if (role === 'admin') return '/admin'
  if (role === 'owner') {
    if (isActive === false) return '/pending-payment'
    return '/dashboard'
  }
  return '/dashboard'
}

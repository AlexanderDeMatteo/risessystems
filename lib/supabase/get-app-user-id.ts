import { createClient } from '@/lib/supabase/server'

/** Returns the current app user id (public.users.id) or null if not authenticated. */
export async function getCurrentAppUserId(): Promise<number | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  return data?.id ?? null
}

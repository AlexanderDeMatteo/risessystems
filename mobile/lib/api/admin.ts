import { supabase } from '@/lib/supabase'
import type { User } from '@/lib/types/user'

export async function fetchAdminClients(): Promise<{ data: User[]; error: string | null }> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, gym_name, role, is_active, created_at')
    .eq('role', 'owner')
    .order('created_at', { ascending: false })

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []) as User[], error: null }
}

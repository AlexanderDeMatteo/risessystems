import { supabase } from '@/lib/supabase'
import type { Member } from '@/lib/types/member'

export async function fetchMyMemberRow(): Promise<{ data: Member | null; error: string | null }> {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) return { data: null, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('auth_user_id', uid)
    .maybeSingle()

  if (error) return { data: null, error: error.message }
  return { data: data as Member | null, error: null }
}

export async function updateMyMember(updates: {
  first_name?: string
  last_name?: string
  email?: string | null
  phone?: string | null
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase.from('members').update(updates).eq('auth_user_id', uid)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function fetchOwnerMembers(search?: string): Promise<{ data: Member[]; error: string | null }> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return { data: [], error: error.message }
  let rows = (data ?? []) as Member[]
  if (search?.trim()) {
    const q = search.trim().toLowerCase()
    rows = rows.filter(
      (m) =>
        m.first_name.toLowerCase().includes(q) ||
        m.last_name.toLowerCase().includes(q) ||
        (m.email?.toLowerCase().includes(q) ?? false)
    )
  }
  return { data: rows, error: null }
}

import { supabase } from '@/lib/supabase'
import type { Member } from '@/lib/types/member'
import type { Trainer } from '@/lib/types/trainer'

export async function fetchMyTrainerRow(): Promise<{ data: Trainer | null; error: string | null }> {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) return { data: null, error: 'Not authenticated' }

  const { data, error } = await supabase.from('trainers').select('*').eq('auth_user_id', uid).maybeSingle()
  if (error) return { data: null, error: error.message }
  return { data: data as Trainer | null, error: null }
}

export async function updateMyTrainer(updates: {
  name?: string
  email?: string
  phone?: string | null
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase.from('trainers').update(updates).eq('auth_user_id', uid)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function fetchTrainerAssignedMembers(): Promise<{ data: Member[]; error: string | null }> {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) return { data: [], error: 'Not authenticated' }

  const { data: trainer } = await supabase.from('trainers').select('id').eq('auth_user_id', uid).maybeSingle()
  const trainerId = (trainer as { id: number } | null)?.id
  if (!trainerId) return { data: [], error: 'Trainer profile not found' }

  const { data: links, error: lErr } = await supabase.from('trainer_members').select('member_id').eq('trainer_id', trainerId)

  if (lErr) return { data: [], error: lErr.message }
  const ids = (links ?? []).map((r) => (r as { member_id: number }).member_id)
  if (!ids.length) return { data: [], error: null }

  const { data: members, error: mErr } = await supabase.from('members').select('*').in('id', ids)
  if (mErr) return { data: [], error: mErr.message }
  return { data: (members ?? []) as Member[], error: null }
}

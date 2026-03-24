import { supabase } from '@/lib/supabase'

export type CheckInRow = {
  id: number
  check_in_time: string
  check_out_time: string | null
  duration_minutes: number | null
  member_id: number
}

export async function fetchMyCheckIns(limit = 50): Promise<{ data: CheckInRow[]; error: string | null }> {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) return { data: [], error: 'Not authenticated' }

  const { data: member } = await supabase.from('members').select('id').eq('auth_user_id', uid).maybeSingle()
  const memberId = (member as { id: number } | null)?.id
  if (!memberId) return { data: [], error: 'Member profile not found' }

  const { data, error } = await supabase
    .from('check_ins')
    .select('id, check_in_time, check_out_time, duration_minutes, member_id')
    .eq('member_id', memberId)
    .order('check_in_time', { ascending: false })
    .limit(limit)

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []) as CheckInRow[], error: null }
}

export async function findMemberByQrOrId(qrValue: string): Promise<{ id: number; name: string } | null> {
  const numericId = parseInt(qrValue, 10)
  const byId = !Number.isNaN(numericId)
    ? await supabase.from('members').select('id, first_name, last_name').eq('id', numericId).maybeSingle()
    : { data: null, error: null }

  if (byId.data) {
    const m = byId.data as { id: number; first_name: string; last_name: string }
    return {
      id: m.id,
      name: [m.first_name, m.last_name].filter(Boolean).join(' ').trim() || 'Member',
    }
  }

  const byQr = await supabase
    .from('members')
    .select('id, first_name, last_name')
    .eq('qr_code', qrValue)
    .maybeSingle()

  if (byQr.data) {
    const m = byQr.data as { id: number; first_name: string; last_name: string }
    return {
      id: m.id,
      name: [m.first_name, m.last_name].filter(Boolean).join(' ').trim() || 'Member',
    }
  }

  return null
}

export async function createCheckInForMember(memberId: number): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const { data, error } = await supabase.from('check_ins').insert({ member_id: memberId }).select('id').single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, id: (data as { id: number }).id }
}

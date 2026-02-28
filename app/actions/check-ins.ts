'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { revalidatePath } from 'next/cache'

export type CheckInRow = {
  id: number
  check_in_time: string
  member_id: number
  member_name: string
}

export async function getCheckIns(limit = 50): Promise<CheckInRow[]> {
  const userId = await getCurrentAppUserId()
  if (!userId) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('check_ins')
    .select(`
      id,
      check_in_time,
      member_id,
      members!inner(first_name, last_name, user_id)
    `)
    .eq('members.user_id', userId)
    .order('check_in_time', { ascending: false })
    .limit(limit)
  if (error) return []
  return (data ?? []).map((r: unknown) => {
    const row = r as { id: number; check_in_time: string; member_id: number; members: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] }
    const member = Array.isArray(row.members) ? row.members[0] : row.members
    return {
      id: row.id,
      check_in_time: row.check_in_time,
      member_id: row.member_id,
      member_name: member ? [member.first_name, member.last_name].filter(Boolean).join(' ').trim() || 'Unknown' : 'Unknown',
    }
  })
}

export async function createCheckIn(memberId: number): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('id', memberId)
    .eq('user_id', userId)
    .maybeSingle()
  if (!member) return { ok: false, error: 'Member not found' }
  const { data, error } = await supabase
    .from('check_ins')
    .insert({ member_id: memberId })
    .select('id')
    .single()
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/qr-scanner')
  return { ok: true, id: data.id }
}

/** Resolve member id from QR value (id or qr_code). */
export async function findMemberByQrOrId(qrValue: string): Promise<{ id: number; name: string } | null> {
  const userId = await getCurrentAppUserId()
  if (!userId) return null
  const supabase = await createClient()
  const numericId = parseInt(qrValue, 10)
  const byId = !Number.isNaN(numericId)
    ? await supabase.from('members').select('id, first_name, last_name').eq('id', numericId).eq('user_id', userId).maybeSingle()
    : { data: null }
  if (byId.data) {
    const m = byId.data as { id: number; first_name: string; last_name: string }
    return { id: m.id, name: [m.first_name, m.last_name].filter(Boolean).join(' ').trim() || 'Member' }
  }
  const byQr = await supabase.from('members').select('id, first_name, last_name').eq('qr_code', qrValue).eq('user_id', userId).maybeSingle()
  if (byQr.data) {
    const m = byQr.data as { id: number; first_name: string; last_name: string }
    return { id: m.id, name: [m.first_name, m.last_name].filter(Boolean).join(' ').trim() || 'Member' }
  }
  return null
}

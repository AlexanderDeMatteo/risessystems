'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isCurrentUserAdmin } from '@/app/actions/admin'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { getTranslations } from 'next-intl/server'
import type {
  Challenge,
  ChallengeGymScore,
  Competition,
  CompetitionDetail,
  CompetitionGym,
  ChallengeMetricType,
  ChallengeNormalization,
  CompetitionStatus,
} from '@/lib/types/competition'

export type ChallengeInput = {
  title: string
  description?: string | null
  metric_type?: ChallengeMetricType
  normalization?: ChallengeNormalization
  points_weight?: number
  sort_order?: number
}

async function assertAdmin() {
  const ok = await isCurrentUserAdmin()
  if (!ok) {
    const t = await getTranslations('errors')
    throw new Error(t('notAuthorized'))
  }
}

async function fetchActiveMemberCount(supabase: Awaited<ReturnType<typeof createClient>>, userId: number) {
  const { count, error } = await supabase
    .from('members')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active')
  if (error) throw new Error(error.message)
  return count ?? 0
}

async function fetchGymDisplayName(supabase: Awaited<ReturnType<typeof createClient>>, userId: number) {
  const { data, error } = await supabase
    .from('users')
    .select('gym_name, name')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  const row = data as { gym_name: string | null; name: string } | null
  return row?.gym_name?.trim() || row?.name || 'Gym'
}

function slugifyPublicSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export async function getAdminCompetitions(status?: CompetitionStatus | 'all'): Promise<{
  data: Competition[]
  error: string | null
}> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    let q = supabase.from('competitions').select('*').eq('scope', 'versus').order('created_at', { ascending: false })
    if (status && status !== 'all') {
      q = q.eq('status', status)
    }
    const { data, error } = await q
    if (error) return { data: [], error: error.message }
    return { data: (data ?? []) as Competition[], error: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error'
    return { data: [], error: msg }
  }
}

export async function getAdminCompetitionDetail(competitionId: number): Promise<{
  data: CompetitionDetail | null
  error: string | null
}> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    const { data: comp, error: cErr } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', competitionId)
      .maybeSingle()
    if (cErr) return { data: null, error: cErr.message }
    if (!comp) return { data: null, error: 'Not found' }

    const { data: gyms, error: gErr } = await supabase
      .from('competition_gyms')
      .select('*')
      .eq('competition_id', competitionId)
      .order('id', { ascending: true })
    if (gErr) return { data: null, error: gErr.message }

    const { data: challenges, error: chErr } = await supabase
      .from('challenges')
      .select('*')
      .eq('competition_id', competitionId)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })
    if (chErr) return { data: null, error: chErr.message }

    const challengeIds = (challenges ?? []).map((c) => (c as { id: number }).id)
    let scoresByChallenge: Record<number, ChallengeGymScore[]> = {}
    if (challengeIds.length > 0) {
      const { data: scores, error: sErr } = await supabase
        .from('challenge_gym_scores')
        .select('*')
        .in('challenge_id', challengeIds)
      if (sErr) return { data: null, error: sErr.message }
      for (const s of scores ?? []) {
        const row = s as ChallengeGymScore
        if (!scoresByChallenge[row.challenge_id]) scoresByChallenge[row.challenge_id] = []
        scoresByChallenge[row.challenge_id].push(row)
      }
    }

    const detail: CompetitionDetail = {
      competition: comp as Competition,
      gyms: (gyms ?? []) as CompetitionGym[],
      challenges: (challenges ?? []).map((ch) => {
        const c = ch as Challenge
        return {
          ...c,
          scores: scoresByChallenge[c.id] ?? [],
        }
      }),
    }
    return { data: detail, error: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error'
    return { data: null, error: msg }
  }
}

export async function createVersusCompetition(payload: {
  title: string
  description?: string | null
  starts_at: string
  ends_at: string
  gym_a_user_id: number
  gym_b_user_id: number
  challenges: ChallengeInput[]
}): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const t = await getTranslations('errors')
  try {
    await assertAdmin()
    const adminId = await getCurrentAppUserId()
    if (!adminId) return { ok: false, error: t('notAuthenticated') }
    if (payload.gym_a_user_id === payload.gym_b_user_id) {
      return { ok: false, error: 'Select two different gyms' }
    }
    if (!payload.challenges?.length) {
      return { ok: false, error: 'Add at least one challenge' }
    }

    const supabase = await createClient()

    const { data: inserted, error: insErr } = await supabase
      .from('competitions')
      .insert({
        created_by_user_id: adminId,
        scope: 'versus',
        title: payload.title.trim(),
        description: payload.description?.trim() || null,
        status: 'draft',
        starts_at: payload.starts_at,
        ends_at: payload.ends_at,
      })
      .select('id')
      .single()
    if (insErr) return { ok: false, error: insErr.message }
    const competitionId = (inserted as { id: number }).id

    for (const uid of [payload.gym_a_user_id, payload.gym_b_user_id]) {
      const name = await fetchGymDisplayName(supabase, uid)
      const active = await fetchActiveMemberCount(supabase, uid)
      const { error: gErr } = await supabase.from('competition_gyms').insert({
        competition_id: competitionId,
        user_id: uid,
        gym_name_snapshot: name,
        active_members_snapshot: active,
      })
      if (gErr) {
        await supabase.from('competitions').delete().eq('id', competitionId)
        return { ok: false, error: gErr.message }
      }
    }

    const challengeRows = payload.challenges.map((c, i) => ({
      competition_id: competitionId,
      title: c.title.trim(),
      description: c.description?.trim() || null,
      metric_type: c.metric_type ?? 'check_in_count',
      normalization: c.normalization ?? 'raw',
      points_weight: c.points_weight ?? 1,
      sort_order: c.sort_order ?? i,
    }))
    const { error: chErr } = await supabase.from('challenges').insert(challengeRows)
    if (chErr) {
      await supabase.from('competitions').delete().eq('id', competitionId)
      return { ok: false, error: chErr.message }
    }

    revalidatePath('/admin/competitions')
    return { ok: true, id: competitionId }
  } catch (e) {
    const msg = e instanceof Error ? e.message : t('error')
    return { ok: false, error: msg }
  }
}

export async function updateVersusDraftMeta(
  competitionId: number,
  payload: { title?: string; description?: string | null; starts_at?: string; ends_at?: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status, scope')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string; scope: string } | null
    if (!row || row.scope !== 'versus' || row.status !== 'draft') {
      return { ok: false, error: 'Only draft versus competitions can be edited' }
    }
    const { error } = await supabase
      .from('competitions')
      .update({
        ...(payload.title != null ? { title: payload.title.trim() } : {}),
        ...(payload.description !== undefined ? { description: payload.description } : {}),
        ...(payload.starts_at != null ? { starts_at: payload.starts_at } : {}),
        ...(payload.ends_at != null ? { ends_at: payload.ends_at } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', competitionId)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/admin/competitions')
    revalidatePath(`/admin/competitions/${competitionId}`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function replaceVersusDraftChallenges(
  competitionId: number,
  challenges: ChallengeInput[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    if (!challenges.length) return { ok: false, error: 'Add at least one challenge' }
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status, scope')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string; scope: string } | null
    if (!row || row.scope !== 'versus' || row.status !== 'draft') {
      return { ok: false, error: 'Only draft versus competitions can be edited' }
    }
    const { error: delErr } = await supabase.from('challenges').delete().eq('competition_id', competitionId)
    if (delErr) return { ok: false, error: delErr.message }
    const rows = challenges.map((c, i) => ({
      competition_id: competitionId,
      title: c.title.trim(),
      description: c.description?.trim() || null,
      metric_type: c.metric_type ?? 'check_in_count',
      normalization: c.normalization ?? 'raw',
      points_weight: c.points_weight ?? 1,
      sort_order: c.sort_order ?? i,
    }))
    const { error: insErr } = await supabase.from('challenges').insert(rows)
    if (insErr) return { ok: false, error: insErr.message }
    revalidatePath(`/admin/competitions/${competitionId}`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function activateCompetition(competitionId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status, scope')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string; scope: string } | null
    if (!row || row.status !== 'draft') return { ok: false, error: 'Invalid state' }
    const { error } = await supabase
      .from('competitions')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', competitionId)
    if (error) return { ok: false, error: error.message }
    const { error: rpcErr } = await supabase.rpc('refresh_competition_scores', { p_competition_id: competitionId })
    if (rpcErr) return { ok: false, error: rpcErr.message }
    revalidatePath('/admin/competitions')
    revalidatePath(`/admin/competitions/${competitionId}`)
    revalidatePath('/dashboard/competitions')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function finalizeCompetition(
  competitionId: number,
  winnerUserId: number | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string } | null
    if (!row || row.status !== 'active') return { ok: false, error: 'Competition must be active' }
    const { error } = await supabase
      .from('competitions')
      .update({
        status: 'completed',
        winner_user_id: winnerUserId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', competitionId)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/admin/competitions')
    revalidatePath(`/admin/competitions/${competitionId}`)
    revalidatePath('/dashboard/competitions')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function cancelCompetition(competitionId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    const { error } = await supabase
      .from('competitions')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', competitionId)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/admin/competitions')
    revalidatePath(`/admin/competitions/${competitionId}`)
    revalidatePath('/dashboard/competitions')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function refreshCompetitionScores(competitionId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    const { error } = await supabase.rpc('refresh_competition_scores', { p_competition_id: competitionId })
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/admin/competitions/${competitionId}`)
    revalidatePath('/dashboard/competitions')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function updatePublicLeaderboard(
  competitionId: number,
  isPublic: boolean,
  slug: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    const cleanSlug = slug ? slugifyPublicSlug(slug) : null
    if (isPublic && (!cleanSlug || cleanSlug.length < 3)) {
      return { ok: false, error: 'Slug must be at least 3 characters' }
    }
    const { error } = await supabase
      .from('competitions')
      .update({
        is_public_leaderboard: isPublic,
        public_slug: isPublic ? cleanSlug : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', competitionId)
    if (error) {
      if (error.code === '23505') return { ok: false, error: 'Slug already in use' }
      return { ok: false, error: error.message }
    }
    revalidatePath(`/admin/competitions/${competitionId}`)
    if (cleanSlug) revalidatePath(`/versus/${cleanSlug}`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function deleteVersusCompetition(competitionId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status, scope')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string; scope: string } | null
    if (!row || row.scope !== 'versus' || row.status !== 'draft') {
      return { ok: false, error: 'Only draft versus competitions can be deleted' }
    }
    const { error } = await supabase.from('competitions').delete().eq('id', competitionId)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/admin/competitions')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function getAdminCompetitionKPIs(): Promise<{
  active: number
  draft: number
  completed: number
  error: string | null
}> {
  try {
    await assertAdmin()
    const supabase = await createClient()
    const [a, d, c] = await Promise.all([
      supabase.from('competitions').select('id', { count: 'exact', head: true }).eq('scope', 'versus').eq('status', 'active'),
      supabase.from('competitions').select('id', { count: 'exact', head: true }).eq('scope', 'versus').eq('status', 'draft'),
      supabase.from('competitions').select('id', { count: 'exact', head: true }).eq('scope', 'versus').eq('status', 'completed'),
    ])
    const err = a.error || d.error || c.error
    if (err) return { active: 0, draft: 0, completed: 0, error: err.message }
    return {
      active: a.count ?? 0,
      draft: d.count ?? 0,
      completed: c.count ?? 0,
      error: null,
    }
  } catch (e) {
    return { active: 0, draft: 0, completed: 0, error: e instanceof Error ? e.message : 'Error' }
  }
}

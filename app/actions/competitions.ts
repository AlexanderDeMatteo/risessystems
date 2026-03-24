'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
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
} from '@/lib/types/competition'
import type { ChallengeInput } from '@/app/actions/admin-competitions'

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

export async function getOwnerCompetitions(): Promise<{ data: Competition[]; error: string | null }> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { data: [], error: t('notAuthenticated') }
  try {
    const supabase = await createClient()
    const { data: links, error: lErr } = await supabase
      .from('competition_gyms')
      .select('competition_id')
      .eq('user_id', userId)
    if (lErr) return { data: [], error: lErr.message }
    const ids = [...new Set((links ?? []).map((r) => (r as { competition_id: number }).competition_id))]
    if (!ids.length) return { data: [], error: null }
    const { data: comps, error: cErr } = await supabase
      .from('competitions')
      .select('*')
      .in('id', ids)
      .order('created_at', { ascending: false })
    if (cErr) return { data: [], error: cErr.message }
    return { data: (comps ?? []) as Competition[], error: null }
  } catch (e) {
    return { data: [], error: e instanceof Error ? e.message : t('error') }
  }
}

export async function getOwnerCompetitionDetail(competitionId: number): Promise<{
  data: CompetitionDetail | null
  error: string | null
}> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { data: null, error: t('notAuthenticated') }
  try {
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

    return {
      data: {
        competition: comp as Competition,
        gyms: (gyms ?? []) as CompetitionGym[],
        challenges: (challenges ?? []).map((ch) => {
          const c = ch as Challenge
          return { ...c, scores: scoresByChallenge[c.id] ?? [] }
        }),
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function createInternalCompetition(payload: {
  title: string
  description?: string | null
  starts_at: string
  ends_at: string
  challenges: ChallengeInput[]
}): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: t('notAuthenticated') }
  if (!payload.challenges?.length) return { ok: false, error: 'Add at least one challenge' }
  try {
    const supabase = await createClient()
    const { data: inserted, error: insErr } = await supabase
      .from('competitions')
      .insert({
        created_by_user_id: userId,
        scope: 'internal',
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

    const name = await fetchGymDisplayName(supabase, userId)
    const active = await fetchActiveMemberCount(supabase, userId)
    const { error: gErr } = await supabase.from('competition_gyms').insert({
      competition_id: competitionId,
      user_id: userId,
      gym_name_snapshot: name,
      active_members_snapshot: active,
    })
    if (gErr) {
      await supabase.from('competitions').delete().eq('id', competitionId)
      return { ok: false, error: gErr.message }
    }

    const challengeRows = payload.challenges.map((c, i) => ({
      competition_id: competitionId,
      title: c.title.trim(),
      description: c.description?.trim() || null,
      metric_type: (c.metric_type ?? 'check_in_count') as ChallengeMetricType,
      normalization: (c.normalization ?? 'raw') as ChallengeNormalization,
      points_weight: c.points_weight ?? 1,
      sort_order: c.sort_order ?? i,
    }))
    const { error: chErr } = await supabase.from('challenges').insert(challengeRows)
    if (chErr) {
      await supabase.from('competitions').delete().eq('id', competitionId)
      return { ok: false, error: chErr.message }
    }

    revalidatePath('/dashboard/competitions')
    return { ok: true, id: competitionId }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : t('error') }
  }
}

export async function updateInternalDraftMeta(
  competitionId: number,
  payload: { title?: string; description?: string | null; starts_at?: string; ends_at?: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: t('notAuthenticated') }
  try {
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status, scope, created_by_user_id')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string; scope: string; created_by_user_id: number } | null
    if (!row || row.scope !== 'internal' || row.created_by_user_id !== userId || row.status !== 'draft') {
      return { ok: false, error: 'Not allowed' }
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
    revalidatePath('/dashboard/competitions')
    revalidatePath(`/dashboard/competitions/${competitionId}`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function replaceInternalDraftChallenges(
  competitionId: number,
  challenges: ChallengeInput[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: t('notAuthenticated') }
  if (!challenges.length) return { ok: false, error: 'Add at least one challenge' }
  try {
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status, scope, created_by_user_id')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string; scope: string; created_by_user_id: number } | null
    if (!row || row.scope !== 'internal' || row.created_by_user_id !== userId || row.status !== 'draft') {
      return { ok: false, error: 'Not allowed' }
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
    revalidatePath(`/dashboard/competitions/${competitionId}`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function activateInternalCompetition(competitionId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: t('notAuthenticated') }
  try {
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status, scope, created_by_user_id')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string; scope: string; created_by_user_id: number } | null
    if (!row || row.scope !== 'internal' || row.created_by_user_id !== userId || row.status !== 'draft') {
      return { ok: false, error: 'Not allowed' }
    }
    const { error } = await supabase
      .from('competitions')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', competitionId)
    if (error) return { ok: false, error: error.message }
    const { error: rpcErr } = await supabase.rpc('refresh_competition_scores', { p_competition_id: competitionId })
    if (rpcErr) return { ok: false, error: rpcErr.message }
    revalidatePath('/dashboard/competitions')
    revalidatePath(`/dashboard/competitions/${competitionId}`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function finalizeInternalCompetition(
  competitionId: number,
  winnerUserId: number | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: t('notAuthenticated') }
  try {
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status, scope, created_by_user_id')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string; scope: string; created_by_user_id: number } | null
    if (!row || row.scope !== 'internal' || row.created_by_user_id !== userId || row.status !== 'active') {
      return { ok: false, error: 'Not allowed' }
    }
    const { error } = await supabase
      .from('competitions')
      .update({
        status: 'completed',
        winner_user_id: winnerUserId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', competitionId)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/dashboard/competitions')
    revalidatePath(`/dashboard/competitions/${competitionId}`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function refreshInternalScores(competitionId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: t('notAuthenticated') }
  try {
    const supabase = await createClient()
    const { error } = await supabase.rpc('refresh_competition_scores', { p_competition_id: competitionId })
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/dashboard/competitions/${competitionId}`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

/** Public leaderboard (anon RLS). No auth required. */
export async function getPublicCompetitionBySlug(slug: string): Promise<{
  data: CompetitionDetail | null
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data: comp, error: cErr } = await supabase
      .from('competitions')
      .select('*')
      .eq('public_slug', slug.trim().toLowerCase())
      .maybeSingle()
    if (cErr) return { data: null, error: cErr.message }
    if (!comp) return { data: null, error: 'Not found' }
    const c = comp as Competition
    if (!c.is_public_leaderboard || !['active', 'completed'].includes(c.status)) {
      return { data: null, error: 'Not found' }
    }
    const competitionId = c.id
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
    if (chErr) return { data: null, error: chErr.message }
    const challengeIds = (challenges ?? []).map((x) => (x as { id: number }).id)
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
    return {
      data: {
        competition: c,
        gyms: (gyms ?? []) as CompetitionGym[],
        challenges: (challenges ?? []).map((ch) => {
          const chRow = ch as Challenge
          return { ...chRow, scores: scoresByChallenge[chRow.id] ?? [] }
        }),
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function deleteInternalCompetition(competitionId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: t('notAuthenticated') }
  try {
    const supabase = await createClient()
    const { data: comp, error: fErr } = await supabase
      .from('competitions')
      .select('id, status, scope, created_by_user_id')
      .eq('id', competitionId)
      .maybeSingle()
    if (fErr) return { ok: false, error: fErr.message }
    const row = comp as { status: string; scope: string; created_by_user_id: number } | null
    if (!row || row.scope !== 'internal' || row.created_by_user_id !== userId || row.status !== 'draft') {
      return { ok: false, error: 'Not allowed' }
    }
    const { error } = await supabase.from('competitions').delete().eq('id', competitionId)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/dashboard/competitions')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error' }
  }
}

import { supabase } from '@/lib/supabase'
import type { Challenge, ChallengeGymScore, Competition, CompetitionGym } from '@/lib/types/competition'

export async function fetchMemberInternalCompetitions(): Promise<{
  data: Competition[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('scope', 'internal')
    .in('status', ['active', 'completed'])
    .order('starts_at', { ascending: false })

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []) as Competition[], error: null }
}

export async function fetchCompetitionDetail(competitionId: number): Promise<{
  competition: Competition | null
  gyms: CompetitionGym[]
  challenges: (Challenge & { scores: ChallengeGymScore[] })[]
  error: string | null
}> {
  const { data: comp, error: cErr } = await supabase.from('competitions').select('*').eq('id', competitionId).maybeSingle()
  if (cErr || !comp) return { competition: null, gyms: [], challenges: [], error: cErr?.message ?? 'Not found' }

  const { data: gyms } = await supabase.from('competition_gyms').select('*').eq('competition_id', competitionId)
  const { data: chRows } = await supabase.from('challenges').select('*').eq('competition_id', competitionId).order('sort_order')

  const challenges: (Challenge & { scores: ChallengeGymScore[] })[] = []
  for (const ch of chRows ?? []) {
    const { data: scores } = await supabase.from('challenge_gym_scores').select('*').eq('challenge_id', (ch as Challenge).id)
    challenges.push({ ...(ch as Challenge), scores: (scores ?? []) as ChallengeGymScore[] })
  }

  return {
    competition: comp as Competition,
    gyms: (gyms ?? []) as CompetitionGym[],
    challenges,
    error: null,
  }
}

export async function fetchOwnerCompetitions(): Promise<{ data: Competition[]; error: string | null }> {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []) as Competition[], error: null }
}

export async function fetchAdminVersusCompetitions(): Promise<{ data: Competition[]; error: string | null }> {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('scope', 'versus')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return { data: [], error: error.message }
  return { data: (data ?? []) as Competition[], error: null }
}

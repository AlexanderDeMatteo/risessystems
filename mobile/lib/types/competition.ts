export type CompetitionScope = 'internal' | 'versus'
export type CompetitionStatus = 'draft' | 'active' | 'completed' | 'cancelled'
export type ChallengeMetricType = 'check_in_count' | 'active_member_days' | 'new_member_count' | 'manual_points'
export type ChallengeNormalization = 'raw' | 'per_active_member'

export interface Competition {
  id: number
  created_by_user_id: number
  scope: CompetitionScope
  title: string
  description: string | null
  status: CompetitionStatus
  starts_at: string
  ends_at: string
  public_slug: string | null
  is_public_leaderboard: boolean
  winner_user_id: number | null
  created_at: string
  updated_at: string
}

export interface CompetitionGym {
  id: number
  competition_id: number
  user_id: number
  gym_name_snapshot: string
  active_members_snapshot: number
  joined_at: string
}

export interface Challenge {
  id: number
  competition_id: number
  title: string
  description: string | null
  metric_type: ChallengeMetricType
  normalization: ChallengeNormalization
  points_weight: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ChallengeGymScore {
  id: number
  challenge_id: number
  user_id: number
  raw_value: number
  normalized_value: number
  weighted_points: number
  updated_at: string
}

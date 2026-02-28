/**
 * Types for exercise catalog. Aligned with table exercises.
 */

export interface Exercise {
  id: number
  user_id: number
  name: string
  description: string | null
  muscle_group: string | null
  equipment: string | null
  video_url: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

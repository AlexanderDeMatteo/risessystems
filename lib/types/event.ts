/**
 * Types for events and event registrations. Aligned with tables events, event_registrations.
 */

export type EventType = 'class' | 'competition' | 'social' | 'workshop' | 'other'
export type EventStatus = 'scheduled' | 'cancelled' | 'completed'
export type RegistrationStatus = 'registered' | 'cancelled' | 'attended' | 'no_show'

export interface Event {
  id: number
  user_id: number
  branch_id: number | null
  created_by_trainer_id: number | null
  series_id: string | null
  title: string
  description: string | null
  event_type: EventType
  start_at: string
  end_at: string | null
  location: string | null
  max_capacity: number | null
  cover_image_url: string | null
  is_recurring: boolean
  recurrence_rule: string | null
  recurrence_end_date: string | null
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: number
  event_id: number
  member_id: number
  status: RegistrationStatus
  registered_at: string
  cancelled_at: string | null
  notes: string | null
}

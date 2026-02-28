/**
 * Types for branches. Aligned with future table branches.
 */

export interface Branch {
  id: number
  user_id: number
  name: string
  address: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

/** Minimal branch for dropdowns/selectors */
export interface BranchOption {
  id: string
  name: string
}

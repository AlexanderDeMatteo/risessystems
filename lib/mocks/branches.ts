/**
 * Mock branches for trainer forms (id + name) and branches grid (full details).
 */

export interface BranchOption {
  id: string
  name: string
}

/** Used in trainer form and primary trainer card selector */
export const MOCK_BRANCHES: BranchOption[] = [
  { id: '1', name: 'Downtown Branch' },
  { id: '2', name: 'Westside Branch' },
  { id: '3', name: 'Airport Branch' },
  { id: '4', name: 'North Branch' },
]

export interface Branch {
  id: number
  name: string
  address: string
  phone: string
  email: string
  members: number
  status: string
}

export const MOCK_BRANCHES_GRID: Branch[] = [
  { id: 1, name: 'Downtown Branch', address: '123 Main St, City Center', phone: '555-0100', email: 'downtown@gym.com', members: 345, status: 'active' },
  { id: 2, name: 'Westside Branch', address: '456 West Ave, West District', phone: '555-0101', email: 'westside@gym.com', members: 287, status: 'active' },
  { id: 3, name: 'Airport Branch', address: '789 Airport Rd, Near Terminal', phone: '555-0102', email: 'airport@gym.com', members: 156, status: 'active' },
  { id: 4, name: 'North Branch', address: '321 North Blvd, North Zone', phone: '555-0103', email: 'north@gym.com', members: 198, status: 'active' },
]

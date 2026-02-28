/**
 * Mock check-ins for QR check-in history.
 */

export interface CheckInRecord {
  id: number
  name: string
  check_in_time: string
}

export const MOCK_CHECK_INS: CheckInRecord[] = [
  { id: 1, name: 'John Smith', check_in_time: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 2, name: 'Sarah Johnson', check_in_time: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 3, name: 'Emma Wilson', check_in_time: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 4, name: 'Mike Davis', check_in_time: new Date(Date.now() - 90 * 60000).toISOString() },
  { id: 5, name: 'David Brown', check_in_time: new Date(Date.now() - 150 * 60000).toISOString() },
]

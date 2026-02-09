import type { Member } from '@/components/members/members-table'

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const today = new Date().toISOString().slice(0, 10)

/** Shared initial members with join_date and expiry_date for Members page and Accounting renewals list */
export function getInitialMembers(): Member[] {
  return [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '555-0001', membership_type: 'premium', status: 'active', join_date: addDays(today, -60), expiry_date: addDays(today, 305) },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0002', membership_type: 'standard', status: 'active', join_date: addDays(today, -20), expiry_date: addDays(today, 70) },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', phone: '555-0003', membership_type: 'basic', status: 'suspended', join_date: addDays(today, -45), expiry_date: addDays(today, -5) },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', phone: '555-0004', membership_type: 'premium', status: 'active', join_date: addDays(today, -100), expiry_date: addDays(today, 4) },
    { id: 5, name: 'David Brown', email: 'david@example.com', phone: '555-0005', membership_type: 'standard', status: 'inactive', join_date: addDays(today, -90), expiry_date: addDays(today, -30) },
  ]
}

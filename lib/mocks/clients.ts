/**
 * Shared mock clients for admin (Clients table and Plans "Clients by plan").
 * Replace with API later.
 */

export interface MockClient {
  id: number
  name: string
  email: string
  phone: string
  branches: number
  activeUsers: number
  status: string
  joinDate: string
}

export const MOCK_CLIENTS: MockClient[] = [
  {
    id: 1,
    name: 'FitZone Gym',
    email: 'admin@fitzone.com',
    phone: '555-0001',
    branches: 3,
    activeUsers: 245,
    status: 'active',
    joinDate: '2023-01-15',
  },
  {
    id: 2,
    name: "Gold's Fitness",
    email: 'admin@golds.com',
    phone: '555-0002',
    branches: 5,
    activeUsers: 412,
    status: 'active',
    joinDate: '2022-06-20',
  },
  {
    id: 3,
    name: 'BodyPower Gym',
    email: 'info@bodypower.com',
    phone: '555-0003',
    branches: 2,
    activeUsers: 178,
    status: 'active',
    joinDate: '2023-03-10',
  },
  {
    id: 4,
    name: 'Elite Sports Club',
    email: 'hello@elite.com',
    phone: '555-0004',
    branches: 4,
    activeUsers: 389,
    status: 'active',
    joinDate: '2022-11-05',
  },
  {
    id: 5,
    name: 'CrossFit HQ',
    email: 'contact@crossfit.com',
    phone: '555-0005',
    branches: 1,
    activeUsers: 95,
    status: 'inactive',
    joinDate: '2024-01-01',
  },
]

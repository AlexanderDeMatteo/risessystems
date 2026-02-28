/**
 * Mock trainers for dashboard trainers page.
 */

export interface Trainer {
  id: number
  name: string
  email: string
  phone: string
  specialties: string
  branch: string
  status: 'active' | 'inactive'
  isPrimary?: boolean
  hireDate?: string
  notes?: string
}

export const MOCK_TRAINERS: Trainer[] = [
  { id: 1, name: 'Carlos Martinez', email: 'carlos@gym.com', phone: '555-0001', specialties: 'CrossFit, Strength', branch: 'Downtown Branch', status: 'active', isPrimary: true },
  { id: 2, name: 'Ana Rodriguez', email: 'ana@gym.com', phone: '555-0002', specialties: 'Yoga, Pilates', branch: 'Westside Branch', status: 'active', isPrimary: false },
  { id: 3, name: 'Jorge Silva', email: 'jorge@gym.com', phone: '555-0003', specialties: 'Boxing, Cardio', branch: 'Downtown Branch', status: 'active', isPrimary: false },
  { id: 4, name: 'Laura Gomez', email: 'laura@gym.com', phone: '555-0004', specialties: 'Personal Training', branch: 'North Branch', status: 'inactive', isPrimary: false },
  { id: 5, name: 'Miguel Ruiz', email: 'miguel@gym.com', phone: '555-0005', specialties: 'Nutrition, Training', branch: 'Airport Branch', status: 'active', isPrimary: false },
]

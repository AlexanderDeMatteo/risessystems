'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, Trash2, Star } from 'lucide-react'

// Mock trainers data
const mockTrainers = [
  { id: 1, name: 'Carlos Martinez', email: 'carlos@gym.com', phone: '555-0001', specialties: 'CrossFit, Strength', status: 'active', isPrimary: true },
  { id: 2, name: 'Ana Rodriguez', email: 'ana@gym.com', phone: '555-0002', specialties: 'Yoga, Pilates', status: 'active', isPrimary: false },
  { id: 3, name: 'Jorge Silva', email: 'jorge@gym.com', phone: '555-0003', specialties: 'Boxing, Cardio', status: 'active', isPrimary: false },
  { id: 4, name: 'Laura Gomez', email: 'laura@gym.com', phone: '555-0004', specialties: 'Personal Training', status: 'inactive', isPrimary: false },
  { id: 5, name: 'Miguel Ruiz', email: 'miguel@gym.com', phone: '555-0005', specialties: 'Nutrition, Training', status: 'active', isPrimary: false },
]

interface TrainersTableProps {
  searchTerm: string
  filterStatus: string
}

export function TrainersTable({ searchTerm, filterStatus }: TrainersTableProps) {
  const [selectedPrimary, setSelectedPrimary] = useState(1)

  const filteredTrainers = mockTrainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || trainer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <Card className="bg-card border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-8"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => (
                <TableRow key={trainer.id} className="border-border hover:bg-secondary/50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPrimary(trainer.id)}
                      className={`p-0 ${selectedPrimary === trainer.id ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`}
                    >
                      <Star className="w-4 h-4" fill={selectedPrimary === trainer.id ? 'currentColor' : 'none'} />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{trainer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{trainer.email}</TableCell>
                  <TableCell className="text-muted-foreground">{trainer.phone}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{trainer.specialties}</TableCell>
                  <TableCell>
                    {trainer.status === 'active' ? (
                      <Badge className="bg-green-900 text-green-100">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-700 text-gray-100">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="hover:bg-secondary">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-destructive/20 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No trainers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

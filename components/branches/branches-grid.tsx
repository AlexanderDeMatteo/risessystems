'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Users, Edit, Trash2 } from 'lucide-react'

// Mock branches data
const mockBranches = [
  {
    id: 1,
    name: 'Downtown Branch',
    address: '123 Main St, City Center',
    phone: '555-0100',
    email: 'downtown@gym.com',
    members: 345,
    status: 'active',
  },
  {
    id: 2,
    name: 'Westside Branch',
    address: '456 West Ave, West District',
    phone: '555-0101',
    email: 'westside@gym.com',
    members: 287,
    status: 'active',
  },
  {
    id: 3,
    name: 'Airport Branch',
    address: '789 Airport Rd, Near Terminal',
    phone: '555-0102',
    email: 'airport@gym.com',
    members: 156,
    status: 'active',
  },
  {
    id: 4,
    name: 'North Branch',
    address: '321 North Blvd, North Zone',
    phone: '555-0103',
    email: 'north@gym.com',
    members: 198,
    status: 'active',
  },
]

interface BranchesGridProps {
  searchTerm: string
}

export function BranchesGrid({ searchTerm }: BranchesGridProps) {
  const filteredBranches = mockBranches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBranches.length > 0 ? (
        filteredBranches.map((branch) => (
          <Card key={branch.id} className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{branch.name}</h3>
                  <Badge className="mt-2 bg-green-900 text-green-100">
                    {branch.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{branch.address}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 border-t border-border/50 pt-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{branch.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground break-all">{branch.email}</span>
                </div>
              </div>

              {/* Members Stats */}
              <div className="bg-secondary/30 rounded-lg p-3 flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{branch.members}</p>
                  <p className="text-xs text-muted-foreground">Active Members</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent border-border">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent border-border text-destructive hover:bg-destructive/20">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-full">
          <Card className="bg-card border-border p-12 text-center">
            <p className="text-muted-foreground">No branches found</p>
          </Card>
        </div>
      )}
    </div>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Users, Edit, Trash2 } from 'lucide-react'

export interface BranchGridItem {
  id: number
  name: string
  address: string | null
  phone: string | null
  email: string | null
  status: string
  members?: number
}

interface BranchesGridProps {
  branches: BranchGridItem[]
  searchTerm: string
}

export function BranchesGrid({ branches, searchTerm }: BranchesGridProps) {
  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (branch.address ?? '').toLowerCase().includes(searchTerm.toLowerCase())
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
                <p className="text-sm text-muted-foreground">{branch.address ?? '—'}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 border-t border-border/50 pt-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{branch.phone ?? '—'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground break-all">{branch.email ?? '—'}</span>
                </div>
              </div>

              {/* Members Stats */}
              <div className="bg-secondary/30 rounded-lg p-3 flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{branch.members ?? 0}</p>
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

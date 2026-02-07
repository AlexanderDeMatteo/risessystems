'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'

interface BranchesHeaderProps {
  onAddClick: () => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function BranchesHeader({
  onAddClick,
  searchTerm,
  onSearchChange,
}: BranchesHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gym Branches</h1>
          <p className="text-muted-foreground">Manage all your gym locations</p>
        </div>
        <Button onClick={onAddClick} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Branch
        </Button>
      </div>

      <div className="flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search branches..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-secondary/50 border-border"
        />
      </div>
    </div>
  )
}

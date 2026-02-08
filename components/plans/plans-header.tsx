'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'

interface PlansHeaderProps {
  onAddClick: () => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function PlansHeader({
  onAddClick,
  searchTerm,
  onSearchChange,
}: PlansHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 relative max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Button onClick={onAddClick} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Plan
      </Button>
    </div>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, UserPlus } from 'lucide-react'

interface MembersHeaderProps {
  onAddClick: () => void
  searchTerm: string
  onSearchChange: (value: string) => void
  filterStatus: string
  onFilterChange: (value: string) => void
}

export function MembersHeader({
  onAddClick,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: MembersHeaderProps) {
  const t = useTranslations('members')
  const tCommon = useTranslations('common')

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <div className="flex-1 relative max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('searchMembers')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={tCommon('status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon('all')} {tCommon('status')}</SelectItem>
            <SelectItem value="active">{tCommon('active')}</SelectItem>
            <SelectItem value="suspended">{tCommon('pending')}</SelectItem>
            <SelectItem value="inactive">{tCommon('inactive')}</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onAddClick} className="gap-2">
          <UserPlus className="w-4 h-4" />
          {t('addMember')}
        </Button>
      </div>
    </div>
  )
}

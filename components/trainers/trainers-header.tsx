'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TrainersHeaderProps {
  onAddClick: () => void
  searchTerm: string
  onSearchChange: (term: string) => void
  filterStatus: string
  onFilterChange: (status: string) => void
}

export function TrainersHeader({
  onAddClick,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: TrainersHeaderProps) {
  const t = useTranslations('trainers')
  const tCommon = useTranslations('common')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button onClick={onAddClick} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('addTrainer')}
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('searchTrainers')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>

        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full md:w-40 bg-secondary/50 border-border">
            <SelectValue placeholder={t('filterByStatus')} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">{t('allStatus')}</SelectItem>
            <SelectItem value="active">{tCommon('active')}</SelectItem>
            <SelectItem value="inactive">{tCommon('inactive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

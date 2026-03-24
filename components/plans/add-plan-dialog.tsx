'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface AddPlanFormData {
  name: string
  description: string
  price: number
  duration_days: number
}

interface AddPlanDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onPlanAdded?: (data: AddPlanFormData) => void
}

export function AddPlanDialog({ isOpen, onOpenChange, onPlanAdded }: AddPlanDialogProps) {
  const t = useTranslations('plans')
  const tCommon = useTranslations('common')

  const DURATION_OPTIONS = [
    { value: 30, label: t('duration1Month') },
    { value: 90, label: t('duration3Months') },
    { value: 180, label: t('duration6Months') },
    { value: 365, label: t('duration1Year') },
  ]

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: 30,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: AddPlanFormData = {
      name: formData.name.trim(),
      description: formData.description.trim() || '',
      price: parseFloat(formData.price),
      duration_days: formData.duration_days,
    }
    onPlanAdded?.(payload)
    onOpenChange(false)
    setFormData({
      name: '',
      description: '',
      price: '',
      duration_days: 30,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>{t('addNewPlan')}</DialogTitle>
          <DialogDescription>
            {t('createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('planName')}</Label>
            <Input
              id="name"
              name="name"
              placeholder={t('planNamePlaceholder')}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('descriptionOptional')}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={t('descriptionPlaceholder')}
              value={formData.description}
              onChange={handleChange}
              className="min-h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('price')} ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder={t('pricePlaceholder')}
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">{t('duration')}</Label>
              <Select
                value={String(formData.duration_days)}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, duration_days: Number(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit">{t('addPlan')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

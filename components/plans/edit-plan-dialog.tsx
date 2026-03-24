'use client'

import { useState, useEffect } from 'react'
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
import { Switch } from '@/components/ui/switch'
import type { MembershipPlan } from '@/lib/types/plans'

interface EditPlanDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  plan: MembershipPlan | null
  onSave: (plan: MembershipPlan) => void
}

export function EditPlanDialog({ isOpen, onOpenChange, plan, onSave }: EditPlanDialogProps) {
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
    is_active: true,
  })

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description ?? '',
        price: String(plan.price),
        duration_days: plan.duration_days,
        is_active: plan.is_active,
      })
    }
  }, [plan])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!plan) return

    const updatedPlan: MembershipPlan = {
      ...plan,
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      duration_days: formData.duration_days,
      is_active: formData.is_active,
    }

    onSave(updatedPlan)
    onOpenChange(false)
  }

  if (!plan) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>{t('editPlan')}</DialogTitle>
          <DialogDescription>
            {t('editDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t('planName')}</Label>
            <Input
              id="edit-name"
              name="name"
              placeholder={t('planNamePlaceholder')}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">{t('descriptionOptional')}</Label>
            <Textarea
              id="edit-description"
              name="description"
              placeholder={t('descriptionPlaceholder')}
              value={formData.description}
              onChange={handleChange}
              className="min-h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">{t('price')} ($)</Label>
              <Input
                id="edit-price"
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
              <Label htmlFor="edit-duration">{t('duration')}</Label>
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

          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div>
              <Label htmlFor="edit-active">{t('activeStatus')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('activeDescription')}
              </p>
            </div>
            <Switch
              id="edit-active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: checked }))
              }
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit">{t('saveChanges')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

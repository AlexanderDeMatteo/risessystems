'use client'

import React from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface AddMemberFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  planId: number | null
}

interface AddMemberDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onMemberAdded?: (data: AddMemberFormData) => void
  plans: { id: number; name: string; duration_days: number }[]
}

const initialFormData: AddMemberFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  planId: null,
}

export function AddMemberDialog({ isOpen, onOpenChange, onMemberAdded, plans }: AddMemberDialogProps) {
  const t = useTranslations('members')
  const tCommon = useTranslations('common')
  const tPlans = useTranslations('plans')
  const [formData, setFormData] = useState<AddMemberFormData>(initialFormData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.planId) return
    onMemberAdded?.(formData)
    onOpenChange(false)
    setFormData(initialFormData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>{t('addMember')}</DialogTitle>
          <DialogDescription>
            {t('memberAdded').replace(' successfully', '')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{tCommon('name')}</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{tCommon('name')}</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{tCommon('email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{tCommon('phone')}</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="555-0000"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">{t('membershipType')}</Label>
            <Select
              value={formData.planId?.toString() ?? ''}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, planId: Number(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={plans.length ? tPlans('title') : tPlans('noPlans')} />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id.toString()}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={!formData.planId || plans.length === 0}>
              {t('addMember')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

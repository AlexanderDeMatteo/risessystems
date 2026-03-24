'use client'

import React from "react"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface AddBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBranchAdded?: (data: { name: string; address: string; phone: string; email: string }) => void | Promise<void>
}

export function AddBranchDialog({ open, onOpenChange, onBranchAdded }: AddBranchDialogProps) {
  const t = useTranslations('branches')
  const tCommon = useTranslations('common')

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onBranchAdded?.(formData)
    onOpenChange(false)
    setFormData({ name: '', address: '', phone: '', email: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t('addNewBranch')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              {t('branchName')}
            </Label>
            <Input
              id="name"
              name="name"
              placeholder={t('branchNamePlaceholder')}
              value={formData.name}
              onChange={handleChange}
              className="bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">
              {t('address')}
            </Label>
            <Textarea
              id="address"
              name="address"
              placeholder={t('enterFullAddress')}
              value={formData.address}
              onChange={handleChange}
              className="bg-secondary/50 border-border min-h-20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              {tCommon('phone')}
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="555-1234"
              value={formData.phone}
              onChange={handleChange}
              className="bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              {tCommon('email')}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="branch@gym.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit">{t('addBranch')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

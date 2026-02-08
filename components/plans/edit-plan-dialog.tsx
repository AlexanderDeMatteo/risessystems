'use client'

import { useState, useEffect } from 'react'
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
import type { MembershipPlan } from './plans-table'

const DURATION_OPTIONS = [
  { value: 30, label: '1 month' },
  { value: 90, label: '3 months' },
  { value: 180, label: '6 months' },
  { value: 365, label: '1 year' },
]

interface EditPlanDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  plan: MembershipPlan | null
  onSave: (plan: MembershipPlan) => void
}

export function EditPlanDialog({ isOpen, onOpenChange, plan, onSave }: EditPlanDialogProps) {
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
          <DialogTitle>Edit Plan</DialogTitle>
          <DialogDescription>
            Update the membership plan details and pricing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Plan Name</Label>
            <Input
              id="edit-name"
              name="name"
              placeholder="e.g. Monthly Premium"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea
              id="edit-description"
              name="description"
              placeholder="What does this plan include?"
              value={formData.description}
              onChange={handleChange}
              className="min-h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="49.99"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration</Label>
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
              <Label htmlFor="edit-active">Active</Label>
              <p className="text-sm text-muted-foreground">
                Inactive plans won&apos;t appear when adding new members
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
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

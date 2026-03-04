'use client'

import React from 'react'
import { useState } from 'react'
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
import { Building2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClientWithPassword } from '@/app/actions/admin'

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const [formData, setFormData] = useState({
    gymName: '',
    email: '',
    phone: '',
    contactPerson: '',
    password: '',
    passwordConfirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFeedback(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' })
      return
    }
    if (formData.password !== formData.passwordConfirm) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' })
      return
    }
    setLoading(true)
    setFeedback(null)
    const result = await createClientWithPassword({
      email: formData.email,
      contactPerson: formData.contactPerson,
      gymName: formData.gymName,
      password: formData.password,
    })
    setLoading(false)
    if (result.ok) {
      toast.success(result.message)
      setFormData({ gymName: '', email: '', phone: '', contactPerson: '', password: '', passwordConfirm: '' })
      onOpenChange(false)
    } else {
      setFeedback({ type: 'error', message: result.error })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Add New Client
          </DialogTitle>
          <DialogDescription>
            Register a new gym as a client in the RisesSystem platform
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gymName">Gym Name</Label>
            <Input
              id="gymName"
              name="gymName"
              placeholder="e.g. FitZone Gym"
              value={formData.gymName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              name="contactPerson"
              placeholder="Name of contact"
              value={formData.contactPerson}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@gym.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="555-0000"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Provisional password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Confirm password</Label>
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="Repeat password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>

          {feedback && (
            <p
              className={
                feedback.type === 'success'
                  ? 'text-sm text-green-500'
                  : 'text-sm text-destructive'
              }
            >
              {feedback.message}
            </p>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create client'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

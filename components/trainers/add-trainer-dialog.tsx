'use client'

import React from "react"

import { useState } from 'react'
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

interface AddTrainerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTrainerDialog({ open, onOpenChange }: AddTrainerDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo: just close the dialog
    onOpenChange(false)
    setFormData({ name: '', email: '', phone: '', specialties: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Trainer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter trainer name"
              value={formData.name}
              onChange={handleChange}
              className="bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="trainer@gym.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="555-1234"
              value={formData.phone}
              onChange={handleChange}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialties" className="text-foreground">
              Specialties (comma separated)
            </Label>
            <Textarea
              id="specialties"
              name="specialties"
              placeholder="e.g. CrossFit, Strength Training"
              value={formData.specialties}
              onChange={handleChange}
              className="bg-secondary/50 border-border min-h-20"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Trainer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

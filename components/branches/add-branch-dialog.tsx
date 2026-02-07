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

interface AddBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBranchDialog({ open, onOpenChange }: AddBranchDialogProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo: just close the dialog
    onOpenChange(false)
    setFormData({ name: '', address: '', phone: '', email: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Branch</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Branch Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Downtown Branch"
              value={formData.name}
              onChange={handleChange}
              className="bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={handleChange}
              className="bg-secondary/50 border-border min-h-20"
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
              placeholder="branch@gym.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Branch</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

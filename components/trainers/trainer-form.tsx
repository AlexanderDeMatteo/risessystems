'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export const MOCK_BRANCHES = [
  { id: '1', name: 'Downtown Branch' },
  { id: '2', name: 'Westside Branch' },
  { id: '3', name: 'Airport Branch' },
  { id: '4', name: 'North Branch' },
] as const

export interface TrainerFormData {
  name: string
  email: string
  phone: string
  branchId: string
  specialties: string
  status: 'active' | 'inactive'
  hireDate: string
  notes: string
  isPrimaryForBranch: boolean
}

const emptyFormData: TrainerFormData = {
  name: '',
  email: '',
  phone: '',
  branchId: '',
  specialties: '',
  status: 'active',
  hireDate: '',
  notes: '',
  isPrimaryForBranch: false,
}

interface TrainerFormProps {
  initialData?: Partial<TrainerFormData>
  /** When editing, pass a stable key (e.g. trainer id) to reset form when switching trainers */
  formKey?: string | number
  onSubmit: (data: TrainerFormData) => void
  onCancel: () => void
  submitLabel: string
}

export function TrainerForm({
  initialData,
  formKey,
  onSubmit,
  onCancel,
  submitLabel,
}: TrainerFormProps) {
  const [formData, setFormData] = useState<TrainerFormData>({
    ...emptyFormData,
    ...initialData,
  })

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({ ...emptyFormData, ...initialData })
    } else {
      setFormData({ ...emptyFormData })
    }
  }, [formKey])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
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
        <Label className="text-foreground">
          Branch
        </Label>
        <Select
          value={formData.branchId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, branchId: value }))}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_BRANCHES.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Where the trainer will work</p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPrimaryForBranch"
          checked={formData.isPrimaryForBranch}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isPrimaryForBranch: checked === true }))
          }
        />
        <Label
          htmlFor="isPrimaryForBranch"
          className="text-sm font-medium text-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Primary trainer for this branch
        </Label>
      </div>
      <p className="text-xs text-muted-foreground -mt-1">
        The primary trainer oversees all trainers at this location
      </p>

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
          className="bg-secondary/50 border-border min-h-16"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'active' | 'inactive') =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hireDate" className="text-foreground">
            Hire Date
          </Label>
          <Input
            id="hireDate"
            name="hireDate"
            type="date"
            value={formData.hireDate}
            onChange={handleChange}
            className="bg-secondary/50 border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-foreground">
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Additional information..."
          value={formData.notes}
          onChange={handleChange}
          className="bg-secondary/50 border-border min-h-16"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}

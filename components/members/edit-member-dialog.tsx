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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Member } from './members-table'

const STATUS_OPTIONS = [
  { value: 'active', labelKey: 'active' },
  { value: 'inactive', labelKey: 'inactive' },
  { value: 'suspended', labelKey: 'pending' },
] as const

interface EditMemberDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  member: Member | null
  onSave: (id: number, updates: { first_name?: string; last_name?: string; email?: string; phone?: string; status?: string }) => void
}

export function EditMemberDialog({ isOpen, onOpenChange, member, onSave }: EditMemberDialogProps) {
  const t = useTranslations('members')
  const tCommon = useTranslations('common')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<string>('inactive')

  useEffect(() => {
    if (member) {
      const [first, ...rest] = member.name.split(' ')
      setFirstName(first ?? '')
      setLastName(rest.join(' ') ?? '')
      setEmail(member.email ?? '')
      setPhone(member.phone ?? '')
      setStatus(member.status ?? 'inactive')
    }
  }, [member])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!member) return

    onSave(member.id, {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      status,
    })
    onOpenChange(false)
  }

  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>{t('editMember')}</DialogTitle>
          <DialogDescription>
            {t('memberUpdated').replace(' successfully', '')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">{tCommon('name')}</Label>
              <Input
                id="edit-firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName">{tCommon('name')}</Label>
              <Input
                id="edit-lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">{tCommon('email')}</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">{tCommon('phone')}</Label>
            <Input
              id="edit-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">{tCommon('status')}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {tCommon(opt.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit">{tCommon('save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

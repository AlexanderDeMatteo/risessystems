'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/routing'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { updateAdminClient, type AdminClient } from '@/app/actions/admin'

interface EditClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: AdminClient | null
}

export function EditClientDialog({ open, onOpenChange, client }: EditClientDialogProps) {
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive' | 'suspended'>('active')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && client) {
      setName(client.name)
      setEmail(client.email)
      setPhone(client.phone ?? '')
      setStatus((client.status as 'active' | 'inactive' | 'suspended') ?? 'active')
      setError(null)
    }
  }, [open, client])

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) setError(null)
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!client) {
      setError(t('noClientSelected'))
      return
    }

    if (!name.trim()) {
      setError(t('nameRequired'))
      return
    }

    if (!email.trim()) {
      setError(t('emailRequired'))
      return
    }

    setSubmitting(true)
    const result = await updateAdminClient({
      id: client.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      status,
    })
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    toast.success(t('clientUpdated'))
    handleClose(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Edit className="w-4 h-4 text-primary" />
            {t('editClient')}
          </DialogTitle>
          <DialogDescription>
            {t('editClientDesc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('gymName')}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary/50 border-border"
              placeholder="My Gym"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50 border-border"
              placeholder="gym@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('phoneOptional')}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-secondary/50 border-border"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('status')}</Label>
            <Select value={status} onValueChange={(v: 'active' | 'inactive' | 'suspended') => setStatus(v)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="inactive">{t('inactive')}</SelectItem>
                <SelectItem value="suspended">{t('suspended')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t('saving')}
                </>
              ) : (
                t('saveChanges')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

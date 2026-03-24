'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { createInternalCompetition } from '@/app/actions/competitions'
import { useToast } from '@/hooks/use-toast'

type ChallengeRow = {
  title: string
  normalization: 'raw' | 'per_active_member'
  points_weight: string
}

function toIsoLocal(value: string) {
  if (!value) return new Date().toISOString()
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

export function DashboardNewInternalForm() {
  const t = useTranslations('competitionsPage')
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [starts, setStarts] = useState(() => {
    const d = new Date()
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
  })
  const [ends, setEnds] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
  })
  const [rows, setRows] = useState<ChallengeRow[]>([
    { title: 'Check-ins', normalization: 'raw', points_weight: '1' },
  ])
  const [pending, setPending] = useState(false)

  function addRow() {
    setRows((r) => [...r, { title: '', normalization: 'raw', points_weight: '1' }])
  }

  function removeRow(i: number) {
    setRows((r) => r.filter((_, idx) => idx !== i))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast({ title: t('toastInvalid'), variant: 'destructive' })
      return
    }
    const challenges = rows
      .filter((row) => row.title.trim())
      .map((row, i) => ({
        title: row.title.trim(),
        metric_type: 'check_in_count' as const,
        normalization: row.normalization,
        points_weight: Number(row.points_weight) || 1,
        sort_order: i,
      }))
    if (!challenges.length) {
      toast({ title: t('toastChallenges'), variant: 'destructive' })
      return
    }
    setPending(true)
    const res = await createInternalCompetition({
      title: title.trim(),
      description: description.trim() || null,
      starts_at: toIsoLocal(starts),
      ends_at: toIsoLocal(ends),
      challenges,
    })
    setPending(false)
    if (!res.ok) {
      toast({ title: res.error, variant: 'destructive' })
      return
    }
    toast({ title: t('toastCreatedInternal') })
    router.push(`/dashboard/competitions/${res.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto px-6 lg:px-8 py-8 space-y-8">
      <Card className="card-cyber border-border/50">
        <CardHeader>
          <CardTitle>{t('newInternalTitle')}</CardTitle>
          <CardDescription>{t('newInternalSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('fieldTitle')}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">{t('fieldDescription')}</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-background" rows={3} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="starts">{t('fieldStarts')}</Label>
              <Input id="starts" type="datetime-local" value={starts} onChange={(e) => setStarts(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ends">{t('fieldEnds')}</Label>
              <Input id="ends" type="datetime-local" value={ends} onChange={(e) => setEnds(e.target.value)} required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-cyber border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('challengesTitle')}</CardTitle>
            <CardDescription>{t('challengesSubtitle')}</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4 mr-1" />
            {t('addChallenge')}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 rounded-lg border border-border/50 bg-card/50">
              <div className="flex justify-between gap-2">
                <span className="text-sm font-medium text-muted-foreground">{t('challengeN', { n: i + 1 })}</span>
                {rows.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(i)} aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                placeholder={t('challengeTitlePh')}
                value={row.title}
                onChange={(e) => {
                  const next = [...rows]
                  next[i] = { ...row, title: e.target.value }
                  setRows(next)
                }}
                className="bg-background"
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">{t('normalization')}</Label>
                  <Select
                    value={row.normalization}
                    onValueChange={(v: 'raw' | 'per_active_member') => {
                      const next = [...rows]
                      next[i] = { ...row, normalization: v }
                      setRows(next)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raw">{t('normRaw')}</SelectItem>
                      <SelectItem value="per_active_member">{t('normPerMember')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t('pointsWeight')}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={row.points_weight}
                    onChange={(e) => {
                      const next = [...rows]
                      next[i] = { ...row, points_weight: e.target.value }
                      setRows(next)
                    }}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="neon-glow-sm">
          {pending ? t('saving') : t('saveDraft')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/competitions')}>
          {t('cancel')}
        </Button>
      </div>
    </form>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import {
  activateInternalCompetition,
  deleteInternalCompetition,
  finalizeInternalCompetition,
  refreshInternalScores,
  replaceInternalDraftChallenges,
  updateInternalDraftMeta,
} from '@/app/actions/competitions'
import type { CompetitionDetail } from '@/lib/types/competition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

export function DashboardCompetitionDetailClient({ initial }: { initial: CompetitionDetail }) {
  const t = useTranslations('competitionsPage')
  const router = useRouter()
  const { toast } = useToast()
  const { competition, gyms, challenges } = initial
  const isVersus = competition.scope === 'versus'
  const isDraft = competition.status === 'draft'
  const isActive = competition.status === 'active'

  const [title, setTitle] = useState(competition.title)
  const [description, setDescription] = useState(competition.description ?? '')
  const [starts, setStarts] = useState(competition.starts_at.slice(0, 16))
  const [ends, setEnds] = useState(competition.ends_at.slice(0, 16))
  const [busy, setBusy] = useState<string | null>(null)

  type DraftChRow = { title: string; normalization: 'raw' | 'per_active_member'; points_weight: string }
  const [draftRows, setDraftRows] = useState<DraftChRow[]>(() =>
    challenges.map((ch) => ({
      title: ch.title,
      normalization: ch.normalization,
      points_weight: String(Number(ch.points_weight)),
    }))
  )

  const challengesSyncKey = challenges
    .map((ch) => [ch.id, ch.title, ch.normalization, ch.points_weight].join(':'))
    .join('|')

  useEffect(() => {
    if (!isVersus && isDraft) {
      setDraftRows(
        challenges.map((ch) => ({
          title: ch.title,
          normalization: ch.normalization,
          points_weight: String(Number(ch.points_weight)),
        }))
      )
    }
  }, [isVersus, isDraft, challengesSyncKey])

  function toIso(value: string) {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? competition.starts_at : d.toISOString()
  }

  async function onSaveChallenges() {
    const payload = draftRows
      .filter((r) => r.title.trim())
      .map((r, i) => ({
        title: r.title.trim(),
        metric_type: 'check_in_count' as const,
        normalization: r.normalization,
        points_weight: Number(r.points_weight) || 1,
        sort_order: i,
      }))
    if (!payload.length) {
      toast({ title: t('toastChallenges'), variant: 'destructive' })
      return
    }
    setBusy('ch')
    const res = await replaceInternalDraftChallenges(competition.id, payload)
    setBusy(null)
    if (!res.ok) toast({ title: res.error, variant: 'destructive' })
    else {
      toast({ title: t('toastChallengesSaved') })
      router.refresh()
    }
  }

  async function onSaveDraft() {
    setBusy('draft')
    const res = await updateInternalDraftMeta(competition.id, {
      title,
      description: description || null,
      starts_at: toIso(starts),
      ends_at: toIso(ends),
    })
    setBusy(null)
    if (!res.ok) toast({ title: res.error, variant: 'destructive' })
    else {
      toast({ title: t('toastSaved') })
      router.refresh()
    }
  }

  async function onActivate() {
    setBusy('act')
    const res = await activateInternalCompetition(competition.id)
    setBusy(null)
    if (!res.ok) toast({ title: res.error, variant: 'destructive' })
    else {
      toast({ title: t('toastActivated') })
      router.refresh()
    }
  }

  async function onRefresh() {
    setBusy('ref')
    const res = await refreshInternalScores(competition.id)
    setBusy(null)
    if (!res.ok) toast({ title: res.error, variant: 'destructive' })
    else {
      toast({ title: t('toastRefreshed') })
      router.refresh()
    }
  }

  async function onFinalize() {
    setBusy('fin')
    const res = await finalizeInternalCompetition(competition.id, null)
    setBusy(null)
    if (!res.ok) toast({ title: res.error, variant: 'destructive' })
    else {
      toast({ title: t('toastFinalized') })
      router.refresh()
    }
  }

  async function onDelete() {
    setBusy('del')
    const res = await deleteInternalCompetition(competition.id)
    setBusy(null)
    if (!res.ok) toast({ title: res.error, variant: 'destructive' })
    else {
      toast({ title: t('toastDeleted') })
      router.push('/dashboard/competitions')
    }
  }

  const totals = gyms.map((g) => ({
    gym: g,
    total: challenges.reduce((sum, ch) => {
      const s = ch.scores.find((x) => x.user_id === g.user_id)
      return sum + (s ? Number(s.weighted_points) : 0)
    }, 0),
  }))

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="uppercase">{competition.status}</Badge>
        <Badge variant="outline">{isVersus ? t('badgeVersus') : t('badgeInternal')}</Badge>
        <span className="text-sm text-muted-foreground">
          {competition.starts_at.slice(0, 10)} → {competition.ends_at.slice(0, 10)}
        </span>
      </div>

      {!isVersus && isDraft && (
        <Card className="card-cyber border-border/50">
          <CardHeader>
            <CardTitle>{t('editDraft')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('fieldTitle')}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>{t('fieldDescription')}</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-background" rows={3} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('fieldStarts')}</Label>
                <Input type="datetime-local" value={starts} onChange={(e) => setStarts(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('fieldEnds')}</Label>
                <Input type="datetime-local" value={ends} onChange={(e) => setEnds(e.target.value)} />
              </div>
            </div>
            <Button type="button" onClick={onSaveDraft} disabled={busy !== null}>
              {busy === 'draft' ? t('saving') : t('saveMeta')}
            </Button>
          </CardContent>
        </Card>
      )}

      {!isVersus && isDraft && (
        <Card className="card-cyber border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('editChallengesDraft')}</CardTitle>
              <CardDescription>{t('editChallengesDraftDesc')}</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDraftRows((r) => [...r, { title: '', normalization: 'raw', points_weight: '1' }])}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('addChallenge')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {draftRows.map((row, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-lg border border-border/50 bg-card/50">
                <div className="flex justify-between gap-2">
                  <span className="text-sm font-medium text-muted-foreground">{t('challengeN', { n: i + 1 })}</span>
                  {draftRows.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDraftRows((r) => r.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input
                  value={row.title}
                  onChange={(e) => {
                    const next = [...draftRows]
                    next[i] = { ...row, title: e.target.value }
                    setDraftRows(next)
                  }}
                  placeholder={t('challengeTitlePh')}
                  className="bg-background"
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">{t('normalization')}</Label>
                    <Select
                      value={row.normalization}
                      onValueChange={(v: 'raw' | 'per_active_member') => {
                        const next = [...draftRows]
                        next[i] = { ...row, normalization: v }
                        setDraftRows(next)
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
                        const next = [...draftRows]
                        next[i] = { ...row, points_weight: e.target.value }
                        setDraftRows(next)
                      }}
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" onClick={onSaveChallenges} disabled={busy !== null}>
              {busy === 'ch' ? t('saving') : t('saveChallenges')}
            </Button>
          </CardContent>
        </Card>
      )}

      {isVersus && competition.winner_user_id && (
        <Card className="card-cyber border-border/50 border-primary/30">
          <CardHeader>
            <CardTitle>{t('winnerTitle')}</CardTitle>
            <CardDescription>
              {gyms.find((g) => g.user_id === competition.winner_user_id)?.gym_name_snapshot ?? t('winnerTie')}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className="card-cyber border-border/50">
        <CardHeader>
          <CardTitle>{t('scoresTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('challengeCol')}</TableHead>
                {gyms.map((g) => (
                  <TableHead key={g.user_id}>{g.gym_name_snapshot}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((ch) => (
                <TableRow key={ch.id}>
                  <TableCell className="font-medium">{ch.title}</TableCell>
                  {gyms.map((g) => {
                    const sc = ch.scores.find((s) => s.user_id === g.user_id)
                    return (
                      <TableCell key={g.user_id}>
                        {sc ? (
                          <span>
                            {Number(sc.raw_value).toFixed(0)} → {Number(sc.weighted_points).toFixed(2)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">{t('total')}</TableCell>
                {totals.map((trow) => (
                  <TableCell key={trow.gym.user_id} className="font-bold text-primary">
                    {trow.total.toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>

          {!isVersus && (isActive || competition.status === 'completed') && (
            <Button type="button" variant="secondary" onClick={onRefresh} disabled={busy !== null}>
              {busy === 'ref' ? t('saving') : t('refreshScores')}
            </Button>
          )}
        </CardContent>
      </Card>

      {!isVersus && isDraft && (
        <div className="flex flex-wrap gap-3">
          <Button onClick={onActivate} disabled={busy !== null} className="neon-glow-sm">
            {busy === 'act' ? t('saving') : t('activate')}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={busy !== null}>
                {t('deleteDraft')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                <AlertDialogDescription>{t('confirmDeleteDesc')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>{t('delete')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {!isVersus && isActive && (
        <Button onClick={onFinalize} disabled={busy !== null}>
          {busy === 'fin' ? t('saving') : t('finalizeInternal')}
        </Button>
      )}
    </div>
  )
}

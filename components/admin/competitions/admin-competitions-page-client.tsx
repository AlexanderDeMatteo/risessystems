'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Plus, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { Competition, CompetitionStatus } from '@/lib/types/competition'

const tabStatuses: (CompetitionStatus | 'all')[] = ['all', 'active', 'draft', 'completed', 'cancelled']

export function AdminCompetitionsPageClient({
  competitions,
  kpis,
}: {
  competitions: Competition[]
  kpis: { active: number; draft: number; completed: number } | null
}) {
  const t = useTranslations('admin.competitionsPage')
  const [tab, setTab] = useState<(typeof tabStatuses)[number]>('all')

  const filtered = useMemo(() => {
    if (tab === 'all') return competitions
    return competitions.filter((c) => c.status === tab)
  }, [competitions, tab])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <Button asChild className="neon-glow-sm">
          <Link href="/admin/competitions/new">
            <Plus className="h-4 w-4 mr-2" />
            {t('newVersus')}
          </Link>
        </Button>
      </div>

      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="card-cyber border-border/50">
            <CardHeader className="py-4">
              <CardDescription>{t('kpiActive')}</CardDescription>
              <CardTitle className="text-3xl text-primary">{kpis.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="card-cyber border-border/50">
            <CardHeader className="py-4">
              <CardDescription>{t('kpiDraft')}</CardDescription>
              <CardTitle className="text-3xl">{kpis.draft}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="card-cyber border-border/50">
            <CardHeader className="py-4">
              <CardDescription>{t('kpiCompleted')}</CardDescription>
              <CardTitle className="text-3xl">{kpis.completed}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as (typeof tabStatuses)[number])}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {tabStatuses.map((s) => (
            <TabsTrigger key={s} value={s} className="capitalize">
              {s === 'all'
                ? t('tabAll')
                : s === 'active'
                  ? t('tabActive')
                  : s === 'draft'
                    ? t('tabDraft')
                    : s === 'completed'
                      ? t('tabCompleted')
                      : t('tabCancelled')}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <Card className="card-cyber border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">{t('empty')}</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((c) => (
              <Card key={c.id} className="card-cyber border-border/50 hover:neon-border transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="uppercase text-xs">
                      {c.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {c.starts_at.slice(0, 10)} → {c.ends_at.slice(0, 10)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/competitions/${c.id}`}>{t('open')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

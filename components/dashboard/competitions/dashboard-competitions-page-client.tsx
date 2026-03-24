'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Plus, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { Competition } from '@/lib/types/competition'

export function DashboardCompetitionsPageClient({ competitions }: { competitions: Competition[] }) {
  const t = useTranslations('competitionsPage')
  const [tab, setTab] = useState<'versus' | 'internal'>('versus')

  const { versus, internal } = useMemo(() => {
    const v = competitions.filter((c) => c.scope === 'versus')
    const i = competitions.filter((c) => c.scope === 'internal')
    return { versus: v, internal: i }
  }, [competitions])

  const list = tab === 'versus' ? versus : internal

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <Button asChild variant="outline" className="neon-glow-sm">
          <Link href="/dashboard/competitions/new">
            <Plus className="h-4 w-4 mr-2" />
            {t('newInternal')}
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'versus' | 'internal')}>
        <TabsList>
          <TabsTrigger value="versus">{t('tabVersus')}</TabsTrigger>
          <TabsTrigger value="internal">{t('tabInternal')}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {list.length === 0 ? (
          <Card className="card-cyber border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">{t('empty')}</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((c) => (
              <Card key={c.id} className="card-cyber border-border/50 hover:neon-border transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="uppercase text-xs">
                      {c.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {c.scope === 'versus' ? t('badgeVersus') : t('badgeInternal')} · {c.starts_at.slice(0, 10)} →{' '}
                    {c.ends_at.slice(0, 10)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/competitions/${c.id}`}>{t('open')}</Link>
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

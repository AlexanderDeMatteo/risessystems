import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getPublicCompetitionBySlug } from '@/app/actions/competitions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Trophy } from 'lucide-react'

export default async function PublicVersusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = await getTranslations('versusPublic')
  const { data, error } = await getPublicCompetitionBySlug(slug)
  if (error || !data) notFound()

  const { competition, gyms, challenges } = data
  const totals = gyms.map((g) => ({
    gym: g,
    total: challenges.reduce((sum, ch) => {
      const s = ch.scores.find((x) => x.user_id === g.user_id)
      return sum + (s ? Number(s.weighted_points) : 0)
    }, 0),
  }))

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Trophy className="h-14 w-14 text-primary neon-glow-sm" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{competition.title}</h1>
          <p className="text-muted-foreground">
            {competition.starts_at.slice(0, 10)} → {competition.ends_at.slice(0, 10)}
          </p>
          <Badge variant="secondary" className="uppercase">
            {competition.status}
          </Badge>
        </div>

        {competition.description && (
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">{competition.description}</p>
        )}

        <Card className="card-cyber border-border/50">
          <CardHeader>
            <CardTitle>{t('leaderboard')}</CardTitle>
            <CardDescription>{t('leaderboardDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('challenge')}</TableHead>
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
                          {sc ? Number(sc.weighted_points).toFixed(2) : '—'}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold">{t('total')}</TableCell>
                  {totals.map((tr) => (
                    <TableCell key={tr.gym.user_id} className="font-bold text-primary">
                      {tr.total.toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">{t('footer')}</p>
      </div>
    </main>
  )
}

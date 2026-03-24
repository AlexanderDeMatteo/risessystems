import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getOwnerCompetitionDetail } from '@/app/actions/competitions'
import { DashboardCompetitionDetailClient } from '@/components/dashboard/competitions/dashboard-competition-detail-client'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'

export default async function DashboardCompetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const competitionId = Number(id)
  if (!Number.isFinite(competitionId)) notFound()

  const t = await getTranslations('competitionsPage')
  const { data, error } = await getOwnerCompetitionDetail(competitionId)
  if (error || !data) notFound()

  return (
    <div className="space-y-6">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-8 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/competitions">{t('backToList')}</Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{data.competition.title}</h1>
      </div>
      <DashboardCompetitionDetailClient
        key={`${data.competition.id}-${data.competition.updated_at}`}
        initial={data}
      />
    </div>
  )
}

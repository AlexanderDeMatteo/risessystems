import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getAdminCompetitionDetail } from '@/app/actions/admin-competitions'
import { AdminCompetitionDetailClient } from '@/components/admin/competitions/admin-competition-detail-client'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'

export default async function AdminCompetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const competitionId = Number(id)
  if (!Number.isFinite(competitionId)) notFound()

  const t = await getTranslations('admin.competitionsPage')
  const { data, error } = await getAdminCompetitionDetail(competitionId)
  if (error || !data) notFound()

  return (
    <main className="p-6 lg:p-8 space-y-6">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/competitions">{t('backToList')}</Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{data.competition.title}</h1>
      </div>
      <AdminCompetitionDetailClient
        key={`${data.competition.id}-${data.competition.updated_at}`}
        initial={data}
      />
    </main>
  )
}

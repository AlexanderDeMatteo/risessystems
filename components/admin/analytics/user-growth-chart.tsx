'use client'

import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { UserGrowthPoint } from '@/app/actions/admin'

interface UserGrowthChartProps {
  data: UserGrowthPoint[]
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const t = useTranslations('admin')

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('userRegistrationActivity')}</h2>
          <p className="text-sm text-muted-foreground">{t('monthlyTrendAnalysis')}</p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Legend />
            <Bar dataKey="newUsers" name={t('newGymOwners')} fill="hsl(220 90% 56%)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="newAffiliados" name={t('newAffiliados')} fill="hsl(39 89% 49%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

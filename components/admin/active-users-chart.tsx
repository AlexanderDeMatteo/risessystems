'use client'

import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ActiveUsersChartPoint } from '@/app/actions/admin'

interface ActiveUsersChartProps {
  data: ActiveUsersChartPoint[]
}

export function ActiveUsersChart({ data }: ActiveUsersChartProps) {
  const t = useTranslations('admin')

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('affiliadosByMonth')}</h2>
          <p className="text-sm text-muted-foreground">{t('affiliadosSubtitle')}</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(220 90% 56%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(220 90% 56%)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

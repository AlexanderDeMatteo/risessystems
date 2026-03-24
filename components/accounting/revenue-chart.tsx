'use client'

import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export type RevenueChartPoint = {
  name: string
  memberships: number
  training: number
  other: number
}

interface RevenueChartProps {
  data?: RevenueChartPoint[]
}

export function RevenueChart({ data = [] }: RevenueChartProps) {
  const t = useTranslations('accounting')
  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">{t('revenueTrend')}</h3>
          <p className="text-sm text-muted-foreground">{t('monthlyRevenueBreakdown')}</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="memberships"
              stroke="hsl(var(--primary))"
              name={t('membership')}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="training"
              stroke="hsl(var(--chart-2))"
              name={t('personalTraining')}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="other"
              stroke="hsl(var(--chart-3))"
              name={t('other')}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

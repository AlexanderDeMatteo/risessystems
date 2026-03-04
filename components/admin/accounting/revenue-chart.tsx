'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { AdminRevenueChartPoint } from '@/app/actions/admin'

interface RevenueChartProps {
  data: AdminRevenueChartPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Revenue Trend</h2>
          <p className="text-sm text-muted-foreground">Monthly revenue breakdown</p>
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
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
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

'use client'

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type SalesChartPoint = {
  date: string
  sales: number
  members: number
  checkins: number
}

interface SalesChartProps {
  data?: SalesChartPoint[]
}

export function SalesChart({ data = [] }: SalesChartProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-5))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="members"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="checkins"
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-4))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

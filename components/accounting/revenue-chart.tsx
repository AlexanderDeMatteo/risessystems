'use client'

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

const data = [
  {
    name: 'Week 1',
    memberships: 2800,
    training: 1398,
    other: 400,
  },
  {
    name: 'Week 2',
    memberships: 3200,
    training: 1500,
    other: 500,
  },
  {
    name: 'Week 3',
    memberships: 2800,
    training: 1200,
    other: 350,
  },
  {
    name: 'Week 4',
    memberships: 3500,
    training: 1800,
    other: 450,
  },
]

export function RevenueChart() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">Revenue Trend</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue breakdown</p>
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
              name="Memberships"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="training"
              stroke="hsl(var(--chart-2))"
              name="Personal Training"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="other"
              stroke="hsl(var(--chart-3))"
              name="Other"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

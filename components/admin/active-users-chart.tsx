'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { month: 'Jan', users: 1200, activeRate: 45 },
  { month: 'Feb', users: 1450, activeRate: 52 },
  { month: 'Mar', users: 1680, activeRate: 58 },
  { month: 'Apr', users: 1920, activeRate: 62 },
  { month: 'May', users: 2150, activeRate: 65 },
  { month: 'Jun', users: 2451, activeRate: 68 },
]

export function ActiveUsersChart() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Active Users by Month</h2>
          <p className="text-sm text-muted-foreground">Across all gym clients</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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

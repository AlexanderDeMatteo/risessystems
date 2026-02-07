'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', newUsers: 240, activeUsers: 1200, churn: 45 },
  { month: 'Feb', newUsers: 280, activeUsers: 1450, churn: 52 },
  { month: 'Mar', newUsers: 320, activeUsers: 1680, churn: 58 },
  { month: 'Apr', newUsers: 350, activeUsers: 1920, churn: 62 },
  { month: 'May', newUsers: 410, activeUsers: 2150, churn: 65 },
  { month: 'Jun', newUsers: 480, activeUsers: 2451, churn: 68 },
]

export function UserGrowthChart() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">User Registration & Activity</h2>
          <p className="text-sm text-muted-foreground">Monthly trend analysis</p>
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
            <Bar dataKey="newUsers" fill="hsl(220 90% 56%)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="activeUsers" fill="hsl(39 89% 49%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

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

const data = [
  { date: 'Jan 1', sales: 2400, members: 1200, checkins: 950 },
  { date: 'Jan 8', sales: 3210, members: 1380, checkins: 1100 },
  { date: 'Jan 15', sales: 2900, members: 1500, checkins: 1200 },
  { date: 'Jan 22', sales: 3800, members: 1700, checkins: 1450 },
  { date: 'Jan 29', sales: 4200, members: 1890, checkins: 1680 },
  { date: 'Feb 5', sales: 4900, members: 2100, checkins: 1950 },
  { date: 'Feb 12', sales: 5200, members: 2300, checkins: 2100 },
]

export function SalesChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404557" />
            <XAxis dataKey="date" stroke="#909CAF" />
            <YAxis stroke="#909CAF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1D2E',
                border: '1px solid #404557',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E8EAED' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="members"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="checkins"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

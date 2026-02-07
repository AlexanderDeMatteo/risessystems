'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const membershipData = [
  { name: 'Premium', value: 340, color: '#3B82F6' },
  { name: 'Standard', value: 380, color: '#10B981' },
  { name: 'Basic', value: 127, color: '#F59E0B' },
]

export function MemberInsights() {
  const total = membershipData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Membership Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {membershipData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {((item.value / total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="text-2xl font-bold text-foreground">{total}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User } from 'lucide-react'

// Mock check-in data
const mockCheckIns = [
  { id: 1, name: 'John Smith', check_in_time: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 2, name: 'Sarah Johnson', check_in_time: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 3, name: 'Emma Wilson', check_in_time: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 4, name: 'Mike Davis', check_in_time: new Date(Date.now() - 90 * 60000).toISOString() },
  { id: 5, name: 'David Brown', check_in_time: new Date(Date.now() - 150 * 60000).toISOString() },
]

export function CheckInHistory() {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    return date.toLocaleDateString()
  }

  const isLoading = false; // Declare isLoading variable
  const checkins = mockCheckIns; // Declare checkins variable

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-foreground">Check-In History</h2>
          <p className="text-sm text-muted-foreground">Recent member check-ins</p>
        </div>

        {/* List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {mockCheckIns.length > 0 ? (
            mockCheckIns.map((checkin: any) => (
              <div
                key={checkin.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 rounded-lg p-2">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{checkin.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(checkin.check_in_time)}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-900 text-green-100">Check-in</Badge>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No check-ins yet</p>
          )}
        </div>
      </div>
    </Card>
  )
}

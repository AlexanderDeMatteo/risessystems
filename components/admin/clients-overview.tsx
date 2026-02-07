import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const clients = [
  { id: 1, name: 'FitZone Gym', branches: 3, activeUsers: 245, status: 'active' },
  { id: 2, name: 'Gold\'s Fitness', branches: 5, activeUsers: 412, status: 'active' },
  { id: 3, name: 'BodyPower Gym', branches: 2, activeUsers: 178, status: 'active' },
  { id: 4, name: 'Elite Sports Club', branches: 4, activeUsers: 389, status: 'active' },
  { id: 5, name: 'CrossFit HQ', branches: 1, activeUsers: 95, status: 'inactive' },
]

export function ClientsOverview() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Top Clients</h2>
          <p className="text-sm text-muted-foreground">By active users</p>
        </div>

        <div className="space-y-3">
          {clients.slice(0, 5).map((client) => (
            <div key={client.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{client.name}</p>
                <p className="text-xs text-muted-foreground">{client.branches} branches • {client.activeUsers} users</p>
              </div>
              <Badge className={client.status === 'active' ? 'bg-green-900 text-green-100' : 'bg-gray-700 text-gray-100'}>
                {client.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

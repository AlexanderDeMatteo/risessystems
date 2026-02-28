import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_CLIENTS } from '@/lib/mocks/clients'

export function ClientsOverview() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Top Clients</h2>
          <p className="text-sm text-muted-foreground">By active users</p>
        </div>

        <div className="space-y-3">
          {MOCK_CLIENTS.slice(0, 5).map((client) => (
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

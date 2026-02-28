'use client'

import { Card } from '@/components/ui/card'
import { QRScanner } from '@/components/qr/qr-scanner'
import { CheckInHistory } from '@/components/qr/check-in-history'
import { useRealtimeCheckIns } from '@/hooks/use-realtime-check-ins'
import { findMemberByQrOrId, createCheckIn } from '@/app/actions/check-ins'
import type { CheckInRow } from '@/app/actions/check-ins'

interface QRScannerPageClientProps {
  initialCheckIns: CheckInRow[]
}

export function QRScannerPageClient({ initialCheckIns }: QRScannerPageClientProps) {
  const { checkIns } = useRealtimeCheckIns(initialCheckIns)
  const checkInItems = checkIns.map((r) => ({ id: r.id, check_in_time: r.check_in_time, member_name: r.member_name }))
  const resolveScan = async (value: string) => {
    const member = await findMemberByQrOrId(value)
    if (!member) return null
    const result = await createCheckIn(member.id)
    if (!result.ok) return null
    return { id: String(member.id), name: member.name }
  }

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QR Access Control</h1>
          <p className="text-muted-foreground mt-1">Scan member QR codes for access</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QRScanner onScan={() => {}} resolveScan={resolveScan} />
          </div>
          <div className="space-y-4">
            <Card className="bg-card border-border p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm">Today&apos;s Check-ins</p>
                  <p className="text-3xl font-bold text-foreground">{checkInItems.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Recently scanned</p>
                  <p className="text-3xl font-bold text-primary">{checkInItems.length > 0 ? checkInItems.length : '—'}</p>
                </div>
              </div>
            </Card>
            <CheckInHistory checkIns={checkInItems} />
          </div>
        </div>
      </div>
    </main>
  )
}

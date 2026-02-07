'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card } from "@/components/ui/card"
import { QRScanner } from '@/components/qr/qr-scanner'
import { CheckInHistory } from '@/components/qr/check-in-history'

export default function QRScannerPage() {
  const [checkIns, setCheckIns] = useState([]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">QR Access Control</h1>
            <p className="text-muted-foreground mt-1">Scan member QR codes for access</p>
          </div>

          {/* Scanner and history */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scanner */}
            <div className="lg:col-span-2">
              <QRScanner onScan={(memberName) => {
                setCheckIns(prev => [
                  {
                    id: Date.now(),
                    memberName,
                    time: new Date(),
                    type: 'check-in',
                  },
                  ...prev,
                ])
              }} />
            </div>

            {/* Stats and recent activity */}
            <div className="space-y-4">
              <Card className="bg-card border-border p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Today's Check-ins</p>
                    <p className="text-3xl font-bold text-foreground">24</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Currently Active</p>
                    <p className="text-3xl font-bold text-primary">8</p>
                  </div>
                </div>
              </Card>
            <CheckInHistory checkIns={checkIns} />
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}

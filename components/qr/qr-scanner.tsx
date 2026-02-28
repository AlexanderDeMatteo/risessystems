'use client'

import React from "react"

import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Scan, CheckCircle, AlertTriangle } from 'lucide-react'
import { MOCK_QR_MEMBERS } from '@/lib/mocks/qr-members'

interface QRScannerProps {
  onScan?: (memberData: { id: string; name: string }) => void
  /** When provided, used instead of mock lookup (e.g. findMemberByQrOrId + createCheckIn). */
  resolveScan?: (value: string) => Promise<{ id: string; name: string } | null>
}

export function QRScanner({ onScan, resolveScan }: QRScannerProps) {
  const [qrInput, setQrInput] = useState('')
  const [scanResult, setScanResult] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleScan = async (value: string) => {
    setIsProcessing(true)
    let member: { id: string; name: string } | null = null
    if (resolveScan) {
      member = await resolveScan(value)
    } else {
      const name = MOCK_QR_MEMBERS[value]
      if (name) member = { id: value, name }
    }
    if (member) {
      setScanResult({
        type: 'success',
        message: `Welcome, ${member.name}!`,
      })
      onScan?.({ id: member.id, name: member.name })
    } else {
      setScanResult({
        type: 'error',
        message: 'Member not found. Please try again.',
      })
    }
    setTimeout(() => {
      setQrInput('')
      setScanResult({ type: null, message: '' })
      setIsProcessing(false)
      inputRef.current?.focus()
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (qrInput.trim()) {
      void handleScan(qrInput.trim())
    }
  }

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-6">
        {/* Scanner header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 rounded-lg p-3">
            <Scan className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">QR Code Scanner</h2>
            <p className="text-sm text-muted-foreground">Scan or enter QR codes</p>
          </div>
        </div>

        {/* Scanner input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Scan QR code here..."
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            className="text-lg p-4"
            autoFocus
          />

          <Button type="submit" className="w-full" disabled={!qrInput.trim()}>
            Process Scan
          </Button>
        </form>

        {/* Scan result */}
        {scanResult.type && (
          <Alert variant={scanResult.type === 'success' ? 'default' : 'destructive'}>
            <div className="flex items-center gap-2">
              {scanResult.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>{scanResult.message}</AlertDescription>
            </div>
          </Alert>
        )}


      </div>
    </Card>
  )
}

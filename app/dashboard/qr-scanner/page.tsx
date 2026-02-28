import { getCheckIns } from '@/app/actions/check-ins'
import { QRScannerPageClient } from './qr-scanner-page-client'

export default async function QRScannerPage() {
  const initialCheckIns = await getCheckIns(50)
  return <QRScannerPageClient initialCheckIns={initialCheckIns} />
}

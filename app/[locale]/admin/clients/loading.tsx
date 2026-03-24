import { Loader2 } from 'lucide-react'

export default function AdminClientsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  )
}

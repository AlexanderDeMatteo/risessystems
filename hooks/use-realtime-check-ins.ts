'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCheckIns } from '@/app/actions/check-ins'
import type { CheckInRow } from '@/app/actions/check-ins'

export function useRealtimeCheckIns(initialCheckIns: CheckInRow[] = []) {
  const [checkIns, setCheckIns] = useState<CheckInRow[]>(initialCheckIns)

  useEffect(() => {
    let mounted = true
    const refetch = () => getCheckIns(50).then((r) => mounted && setCheckIns(r.checkIns))

    refetch()

    const supabase = createClient()
    const channel = supabase
      .channel('check_ins_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'check_ins' },
        () => refetch()
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'check_ins' },
        () => refetch()
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  return { checkIns }
}

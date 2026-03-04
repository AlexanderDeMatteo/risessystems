const STORAGE_KEY = 'rises-notification-reads'

export function getReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export function addReadId(id: string): void {
  if (typeof window === 'undefined') return
  const ids = getReadIds()
  ids.add(id)
  persistIds(ids)
}

export function addReadIds(ids: string[]): void {
  if (typeof window === 'undefined') return
  const current = getReadIds()
  for (const id of ids) current.add(id)
  persistIds(current)
}

function persistIds(ids: Set<string>) {
  try {
    const arr = [...ids].slice(-200)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  } catch {
    // ignore
  }
}

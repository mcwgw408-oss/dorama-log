import type { Drama } from './types'

const STORAGE_KEY = 'dorama-log-v1'

export function loadDramas(): Drama[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidDrama)
  } catch {
    return []
  }
}

export function saveDramas(dramas: Drama[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dramas))
}

function isValidDrama(value: unknown): value is Drama {
  if (!value || typeof value !== 'object') return false
  const d = value as Record<string, unknown>
  return (
    typeof d.id === 'string' &&
    typeof d.title === 'string' &&
    typeof d.status === 'string' &&
    (d.status === 'watching' || d.status === 'want')
  )
}

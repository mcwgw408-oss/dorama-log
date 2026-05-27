import type { Drama } from './types'

const STORAGE_KEY = 'dorama-log-v1'

export function loadDramas(): Drama[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeDrama).filter(isValidDrama)
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
    typeof d.mediaType === 'string' &&
    (d.mediaType === 'drama' ||
      d.mediaType === 'movie' ||
      d.mediaType === 'book' ||
      d.mediaType === 'manga') &&
    (d.status === 'watching' || d.status === 'want' || d.status === 'finished')
  )
}

function normalizeDrama(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value
  const d = value as Record<string, unknown>
  if (typeof d.mediaType !== 'string') {
    return { ...d, mediaType: 'drama' }
  }
  return d
}

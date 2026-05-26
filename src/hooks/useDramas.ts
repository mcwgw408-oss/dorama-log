import { useCallback, useEffect, useState } from 'react'
import { loadDramas, saveDramas } from '../storage'
import type { Drama, DramaInput, DramaStatus } from '../types'

function createId(): string {
  return crypto.randomUUID()
}

function toDrama(input: DramaInput, id?: string): Drama {
  const now = new Date().toISOString()
  return {
    id: id ?? createId(),
    title: input.title.trim(),
    mediaType: input.mediaType,
    network: input.network.trim(),
    day: input.day.trim(),
    episode: input.episode,
    totalEpisodes: input.totalEpisodes,
    rating: input.rating,
    memo: input.memo.trim(),
    status: input.status,
    createdAt: now,
    updatedAt: now,
  }
}

export function useDramas() {
  const [dramas, setDramas] = useState<Drama[]>(() => loadDramas())

  useEffect(() => {
    saveDramas(dramas)
  }, [dramas])

  const add = useCallback((input: DramaInput) => {
    setDramas((prev) => [...prev, toDrama(input)])
  }, [])

  const update = useCallback((id: string, input: DramaInput) => {
    setDramas((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...toDrama(input, id), createdAt: d.createdAt, updatedAt: new Date().toISOString() }
          : d,
      ),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setDramas((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const setStatus = useCallback((id: string, status: DramaStatus) => {
    setDramas((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d,
      ),
    )
  }, [])

  const watching = dramas.filter((d) => d.status === 'watching')
  const want = dramas.filter((d) => d.status === 'want')

  return { dramas, watching, want, add, update, remove, setStatus }
}

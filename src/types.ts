export type DramaStatus = 'watching' | 'want'

export type Drama = {
  id: string
  title: string
  network: string
  day: string
  episode: number
  totalEpisodes: number | null
  rating: number
  memo: string
  status: DramaStatus
  createdAt: string
  updatedAt: string
}

export type DramaInput = {
  title: string
  network: string
  day: string
  episode: number
  totalEpisodes: number | null
  rating: number
  memo: string
  status: DramaStatus
}

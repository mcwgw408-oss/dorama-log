export type DramaStatus = 'watching' | 'want'
export type MediaType = 'drama' | 'movie' | 'book' | 'manga'

export type Drama = {
  id: string
  title: string
  mediaType: MediaType
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
  mediaType: MediaType
  network: string
  day: string
  episode: number
  totalEpisodes: number | null
  rating: number
  memo: string
  status: DramaStatus
}

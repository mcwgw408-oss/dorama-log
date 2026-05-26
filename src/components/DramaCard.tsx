import {
  BookOpen,
  Check,
  Clock3,
  Film,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
  Tv,
} from 'lucide-react'
import { useState } from 'react'
import type { Drama } from '../types'

type Props = {
  drama: Drama
  onEdit: (drama: Drama) => void
  onDelete: (id: string) => void
  onMoveToWant: (id: string) => void
  onMoveToWatching: (id: string) => void
}

export function DramaCard({ drama, onEdit, onDelete, onMoveToWant, onMoveToWatching }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const mediaLabel = getMediaLabel(drama.mediaType)
  const progress =
    drama.totalEpisodes && drama.totalEpisodes > 0
      ? Math.min(100, Math.round((drama.episode / drama.totalEpisodes) * 100))
      : null

  const episodeLabel =
    drama.totalEpisodes != null
      ? `${drama.episode} / ${drama.totalEpisodes}話`
      : drama.episode > 0
        ? `${drama.episode}話まで`
        : null

  function handleDelete() {
    if (confirm(`「${drama.title}」を削除しますか？`)) {
      onDelete(drama.id)
    }
    setMenuOpen(false)
  }

  return (
    <article className="drama-card">
      <div className={`poster-mark poster-${drama.mediaType}`} aria-hidden="true">
        {getMediaIcon(drama.mediaType)}
      </div>
      <div className="drama-info">
        <div className="drama-title-row">
          <div className="title-stack">
            <p className="media-type-chip">{mediaLabel}</p>
            <h3>{drama.title}</h3>
          </div>
          <div className="card-actions">
            <button
              type="button"
              className="menu-trigger"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="メニュー"
              aria-expanded={menuOpen}
            >
              <MoreVertical size={19} />
            </button>
            {menuOpen && (
              <div className="card-menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onEdit(drama)
                    setMenuOpen(false)
                  }}
                >
                  <Pencil size={16} />
                  編集
                </button>
                {drama.status === 'watching' ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onMoveToWant(drama.id)
                      setMenuOpen(false)
                    }}
                  >
                    <BookOpen size={16} />
                    見たいへ移動
                  </button>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onMoveToWatching(drama.id)
                      setMenuOpen(false)
                    }}
                  >
                    <Tv size={16} />
                    視聴中へ移動
                  </button>
                )}
                <button type="button" role="menuitem" className="danger" onClick={handleDelete}>
                  <Trash2 size={16} />
                  削除
                </button>
              </div>
            )}
          </div>
        </div>

        {drama.network && <p className="network">{drama.network}</p>}

        <div className="meta-row">
          {drama.day && (
            <span>
              <Clock3 size={14} />
              {drama.day}
            </span>
          )}
          {episodeLabel && (
            <span>
              <Check size={14} />
              {episodeLabel}
            </span>
          )}
        </div>

        {progress != null && (
          <div className="progress-wrap" aria-label={`進み具合 ${progress}%`}>
            <span style={{ width: `${progress}%` }} />
          </div>
        )}

        {drama.rating > 0 && (
          <div className="rating" aria-label={`評価 ${drama.rating} / 5`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={15}
                fill={index < drama.rating ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        )}
        {drama.memo && <p className="drama-memo">{drama.memo}</p>}
      </div>
    </article>
  )
}

function getMediaLabel(mediaType: Drama['mediaType']): string {
  switch (mediaType) {
    case 'movie':
      return '映画'
    case 'book':
      return '本'
    case 'manga':
      return '漫画'
    default:
      return 'ドラマ'
  }
}

function getMediaIcon(mediaType: Drama['mediaType']) {
  switch (mediaType) {
    case 'movie':
      return <Film size={25} />
    case 'book':
    case 'manga':
      return <BookOpen size={25} />
    default:
      return <Tv size={25} />
  }
}

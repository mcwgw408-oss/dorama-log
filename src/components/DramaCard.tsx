import { BookOpen, Check, Clock3, Film, MoreVertical, Pencil, Star, Trash2, Tv } from 'lucide-react'
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

  const episodeLabel =
    drama.totalEpisodes != null
      ? `${drama.episode} / ${drama.totalEpisodes}話`
      : drama.episode > 0
        ? `${drama.episode}話`
        : null

  return (
    <article className="drama-card">
      <div className="poster-mark" aria-hidden="true">
        {getMediaIcon(drama.mediaType)}
      </div>
      <div className="drama-info">
        <div className="drama-title-row">
          <h3>{drama.title}</h3>
          <div className="card-actions">
            <button
              type="button"
              className="menu-trigger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="メニュー"
              aria-expanded={menuOpen}
            >
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="card-menu" role="menu">
                <button type="button" role="menuitem" onClick={() => { onEdit(drama); setMenuOpen(false) }}>
                  <Pencil size={15} />
                  編集
                </button>
                {drama.status === 'watching' ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { onMoveToWant(drama.id); setMenuOpen(false) }}
                  >
                    見たいリストへ
                  </button>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { onMoveToWatching(drama.id); setMenuOpen(false) }}
                  >
                    視聴中へ
                  </button>
                )}
                <button
                  type="button"
                  role="menuitem"
                  className="danger"
                  onClick={() => {
                    if (confirm(`「${drama.title}」を削除しますか？`)) {
                      onDelete(drama.id)
                    }
                    setMenuOpen(false)
                  }}
                >
                  <Trash2 size={15} />
                  削除
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="media-type-chip">{mediaLabel}</p>
        {drama.network && <p>{drama.network}</p>}
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
      return <Film size={24} />
    case 'book':
      return <BookOpen size={24} />
    case 'manga':
      return <BookOpen size={24} />
    default:
      return <Tv size={24} />
  }
}

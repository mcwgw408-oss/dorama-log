import { useState } from 'react'
import { X } from 'lucide-react'
import type { Drama, DramaInput, DramaStatus } from '../types'

type Props = {
  open: boolean
  initial?: Drama | null
  defaultStatus: DramaStatus
  onClose: () => void
  onSubmit: (input: DramaInput) => void
}

const emptyForm = (status: DramaStatus): DramaInput => ({
  title: '',
  mediaType: 'drama',
  network: '',
  day: '',
  episode: 0,
  totalEpisodes: null,
  rating: 0,
  memo: '',
  status,
})

export function DramaForm({ open, initial, defaultStatus, onClose, onSubmit }: Props) {
  if (!open) return null

  return (
    <DramaFormContent
      key={initial?.id ?? `new-${defaultStatus}`}
      initial={initial}
      defaultStatus={defaultStatus}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

function initialForm(initial: Drama | null | undefined, defaultStatus: DramaStatus): DramaInput {
  if (!initial) return emptyForm(defaultStatus)
  return {
    title: initial.title,
    mediaType: initial.mediaType ?? 'drama',
    network: initial.network,
    day: initial.day,
    episode: initial.episode,
    totalEpisodes: initial.totalEpisodes,
    rating: initial.rating,
    memo: initial.memo,
    status: initial.status,
  }
}

function DramaFormContent({
  initial,
  defaultStatus,
  onClose,
  onSubmit,
}: Omit<Props, 'open'>) {
  const [form, setForm] = useState<DramaInput>(() => initialForm(initial, defaultStatus))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drama-form-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <p>{initial ? '内容を更新' : '新しく記録'}</p>
            <h2 id="drama-form-title">{initial ? '作品を編集' : '作品を追加'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </header>

        <form className="drama-form" onSubmit={handleSubmit}>
          <label>
            タイトル <span className="required">*</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="例: 海に眠るダイヤモンド"
              required
              autoFocus
            />
          </label>

          <div className="form-row compact">
            <label>
              種類
              <select
                value={form.mediaType}
                onChange={(e) =>
                  setForm({ ...form, mediaType: e.target.value as DramaInput['mediaType'] })
                }
              >
                <option value="drama">ドラマ</option>
                <option value="movie">映画</option>
                <option value="book">本</option>
                <option value="manga">漫画</option>
              </select>
            </label>

            <label>
              リスト
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as DramaStatus })}
              >
                <option value="watching">視聴中</option>
                <option value="want">見たい</option>
              </select>
            </label>
          </div>

          <label>
            放送局・配信先
            <input
              type="text"
              value={form.network}
              onChange={(e) => setForm({ ...form, network: e.target.value })}
              placeholder="例: TBS / Netflix"
            />
          </label>

          <label>
            放送日時・メモ日
            <input
              type="text"
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              placeholder="例: 火曜 22:00"
            />
          </label>

          <div className="form-row compact">
            <label>
              今の話数
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={form.episode || ''}
                onChange={(e) =>
                  setForm({ ...form, episode: Math.max(0, Number(e.target.value) || 0) })
                }
                placeholder="0"
              />
            </label>
            <label>
              全話数
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={form.totalEpisodes ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  setForm({
                    ...form,
                    totalEpisodes: v === '' ? null : Math.max(1, Number(v) || 1),
                  })
                }}
                placeholder="未定"
              />
            </label>
          </div>

          <label>
            評価
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={form.rating >= n ? 'star active' : 'star'}
                  onClick={() => setForm({ ...form, rating: form.rating === n ? 0 : n })}
                  aria-label={`${n}つ星`}
                >
                  ★
                </button>
              ))}
              {form.rating > 0 && (
                <button
                  type="button"
                  className="rating-clear"
                  onClick={() => setForm({ ...form, rating: 0 })}
                >
                  クリア
                </button>
              )}
            </div>
          </label>

          <label>
            メモ
            <textarea
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              placeholder="感想、推しポイント、次に見る前のメモなど"
              rows={3}
            />
          </label>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn-primary">
              {initial ? '保存' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

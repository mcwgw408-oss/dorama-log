import { useMemo, useState } from 'react'
import { Bookmark, Plus, Search, Tv } from 'lucide-react'
import { DramaCard } from './components/DramaCard'
import { DramaForm } from './components/DramaForm'
import { useDramas } from './hooks/useDramas'
import type { Drama, DramaStatus } from './types'

type Tab = 'watching' | 'want'

function App() {
  const { watching, want, add, update, remove, setStatus } = useDramas()
  const [tab, setTab] = useState<Tab>('watching')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Drama | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const list = tab === 'watching' ? watching : want

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.network.toLowerCase().includes(q) ||
        d.memo.toLowerCase().includes(q),
    )
  }, [list, search])

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(drama: Drama) {
    setEditing(drama)
    setFormOpen(true)
  }

  const tabLabel = tab === 'watching' ? '視聴中' : '見たい'

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Dorama Log</p>
          <h1>{tab === 'watching' ? '今楽しんでいる作品' : 'これから楽しみたい作品'}</h1>
        </div>
        <button
          className="icon-button"
          aria-label="検索"
          aria-pressed={searchOpen}
          onClick={() => setSearchOpen((o) => !o)}
        >
          <Search size={20} />
        </button>
      </header>

      {searchOpen && (
        <div className="search-bar">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトル・配信先・メモで検索"
            aria-label="メディアを検索"
          />
        </div>
      )}

      <section className="summary-panel" aria-label="サマリー">
        <div>
          <span className="summary-number">{watching.length}</span>
          <span className="summary-label">視聴中</span>
        </div>
        <div>
          <span className="summary-number">{want.length}</span>
          <span className="summary-label">見たい</span>
        </div>
        <div>
          <span className="summary-number">{watching.length + want.length}</span>
          <span className="summary-label">合計</span>
        </div>
      </section>

      <nav className="tab-nav" aria-label="リスト切り替え">
        <button
          type="button"
          className={tab === 'watching' ? 'active' : ''}
          onClick={() => setTab('watching')}
        >
          <Tv size={18} />
          視聴中
          {watching.length > 0 && <span className="tab-badge">{watching.length}</span>}
        </button>
        <button
          type="button"
          className={tab === 'want' ? 'active' : ''}
          onClick={() => setTab('want')}
        >
          <Bookmark size={18} />
          見たい
          {want.length > 0 && <span className="tab-badge">{want.length}</span>}
        </button>
      </nav>

      <section className="section-block">
        <div className="section-heading">
          <h2>{tabLabel}リスト</h2>
          <button className="add-button" type="button" onClick={openAdd}>
            <Plus size={17} />
            追加
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>
              {search
                ? '該当する項目がありません'
                : tab === 'watching'
                  ? '視聴中・読書中の項目がまだありません'
                  : '見たいリストがまだ空です'}
            </p>
            {!search && (
              <button type="button" className="btn-primary" onClick={openAdd}>
                <Plus size={17} />
                最初の項目を追加
              </button>
            )}
          </div>
        ) : (
          <div className="drama-list">
            {filtered.map((drama) => (
              <DramaCard
                key={drama.id}
                drama={drama}
                onEdit={openEdit}
                onDelete={remove}
                onMoveToWant={(id) => setStatus(id, 'want')}
                onMoveToWatching={(id) => setStatus(id, 'watching')}
              />
            ))}
          </div>
        )}
      </section>

      <DramaForm
        open={formOpen}
        initial={editing}
        defaultStatus={tab as DramaStatus}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={(input) => {
          if (editing) update(editing.id, input)
          else add(input)
        }}
      />
    </main>
  )
}

export default App

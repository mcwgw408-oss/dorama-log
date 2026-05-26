import { useMemo, useState } from 'react'
import { Bookmark, Clapperboard, Plus, Search, Sparkles, Tv, X } from 'lucide-react'
import { DramaCard } from './components/DramaCard'
import { DramaForm } from './components/DramaForm'
import { useDramas } from './hooks/useDramas'
import type { Drama, DramaStatus } from './types'

type Tab = 'watching' | 'want'

const tabCopy = {
  watching: {
    label: '視聴中',
    title: '今楽しんでいる作品',
    empty: '今見ている作品をここに残せます',
  },
  want: {
    label: '見たい',
    title: 'これから見たい作品',
    empty: '次に見たい作品をメモしておけます',
  },
} satisfies Record<Tab, { label: string; title: string; empty: string }>

function App() {
  const { watching, want, add, update, remove, setStatus } = useDramas()
  const [tab, setTab] = useState<Tab>('watching')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Drama | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const list = tab === 'watching' ? watching : want
  const currentTab = tabCopy[tab]

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

  const latestUpdated = useMemo(() => {
    const all = [...watching, ...want].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    return all[0]?.title
  }, [watching, want])

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(drama: Drama) {
    setEditing(drama)
    setFormOpen(true)
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Dorama Log</p>
            <h1>{currentTab.title}</h1>
          </div>
          <button
            className="icon-button"
            aria-label={searchOpen ? '検索を閉じる' : '検索する'}
            aria-pressed={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>

        <div className="hero-note">
          <Sparkles size={16} />
          <span>{latestUpdated ? `最近更新: ${latestUpdated}` : '気になる作品を気軽にメモできます'}</span>
        </div>
      </header>

      {searchOpen && (
        <div className="search-bar">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトル・配信先・メモで検索"
            aria-label="作品を検索"
            autoFocus
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} aria-label="検索語を消す">
              <X size={17} />
            </button>
          )}
        </div>
      )}

      <section className="summary-panel" aria-label="作品数">
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

      <nav className="tab-nav" aria-label="リストを切り替え">
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
          <div>
            <p>{search ? `${filtered.length}件見つかりました` : currentTab.label}</p>
            <h2>{search ? '検索結果' : `${currentTab.label}リスト`}</h2>
          </div>
          <button className="add-button" type="button" onClick={openAdd}>
            <Plus size={19} />
            <span>追加</span>
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">
              <Clapperboard size={28} />
            </div>
            <p>{search ? '該当する作品がありません' : currentTab.empty}</p>
            {!search && (
              <button type="button" className="btn-primary" onClick={openAdd}>
                <Plus size={18} />
                最初の作品を追加
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

      <button className="fab" type="button" onClick={openAdd} aria-label="作品を追加">
        <Plus size={25} />
      </button>

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

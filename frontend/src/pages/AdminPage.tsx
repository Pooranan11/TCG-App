import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useProductStore } from '../store/productStore'
import { useTournamentStore } from '../store/tournamentStore'
import type { Product, Tournament, ProductCategory, TournamentStatus } from '../types'
import client from '../api/client'

// ─── TCG card search ─────────────────────────────────────────────────────────

type CardResult = { id: string; name: string; image: string }

async function searchTcgCards(query: string): Promise<CardResult[]> {
  if (!query.trim()) return []
  try {
    const res = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(query)}*&pageSize=6&select=id,name,images`
    )
    const json = await res.json()
    return (json.data ?? []).map((c: { id: string; name: string; images: { small: string } }) => ({
      id: c.id,
      name: c.name,
      image: c.images.small,
    }))
  } catch {
    return []
  }
}

// ─── Image picker ─────────────────────────────────────────────────────────────

function ImagePicker({ value, onChange }: {
  value: string
  onChange: (url: string) => void
}) {
  const [mode, setMode] = useState<'search' | 'upload'>('upload')
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<CardResult[]>([])
  const [searching, setSearching] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async () => {
    setSearching(true)
    const cards = await searchTcgCards(search)
    setResults(cards)
    setSearching(false)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await client.post<{ url: string }>('/uploads', fd)
      onChange(res.data.url)
    } catch {
      alert('Erreur lors de l\'upload.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="sm:col-span-2 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="block font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase text-white/50">
          Image
        </label>
        <div className="flex gap-1 bg-navy rounded p-0.5">
          <button type="button" onClick={() => setMode('upload')}
            className={`px-3 py-1 text-xs rounded transition-colors ${mode === 'upload' ? 'bg-yellow text-navy font-bold' : 'text-white/50 hover:text-white'}`}>
            Upload
          </button>
          <button type="button" onClick={() => setMode('search')}
            className={`px-3 py-1 text-xs rounded transition-colors ${mode === 'search' ? 'bg-yellow text-navy font-bold' : 'text-white/50 hover:text-white'}`}>
            Recherche carte
          </button>
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div className="flex items-center gap-3">
          <img src={value} alt="" className="h-20 w-20 object-contain rounded border border-white/10 bg-navy" />
          <button type="button" onClick={() => onChange('')}
            className="text-red-400 text-xs hover:text-red-300">Supprimer</button>
        </div>
      )}

      {mode === 'search' ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
              placeholder="Rechercher une carte Pokémon (ex: Pikachu)"
              className="flex-1 bg-navy border border-white/15 text-white placeholder-white/25 px-3 py-2 text-sm rounded focus:outline-none focus:border-yellow"
            />
            <button type="button" onClick={handleSearch} disabled={searching}
              className="btn-primary px-4 text-sm">
              {searching ? '…' : 'Chercher'}
            </button>
          </div>
          {results.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {results.map((c) => (
                <button key={c.id} type="button" onClick={() => { onChange(c.image); setResults([]) }}
                  className={`rounded border-2 overflow-hidden transition-all ${value === c.image ? 'border-yellow' : 'border-white/10 hover:border-yellow/50'}`}>
                  <img src={c.image} alt={c.name} className="w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-yellow bg-yellow/5' : 'border-white/20 hover:border-white/40'
          }`}
        >
          {uploading ? (
            <p className="text-white/50 text-sm">Upload en cours…</p>
          ) : (
            <>
              <p className="text-white/50 text-sm">Glissez une image ici</p>
              <p className="text-white/30 text-xs mt-1">ou cliquez pour parcourir</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f) }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Product form ────────────────────────────────────────────────────────────

const EMPTY_PRODUCT = {
  name: '', description: '', price: 0,
  category: 'TCG' as ProductCategory, stock: 0, image_url: '',
}

function ProductForm({
  initial, onSave, onCancel,
}: {
  initial?: Partial<Product>
  onSave: (data: typeof EMPTY_PRODUCT) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    ...EMPTY_PRODUCT,
    ...initial,
    description: initial?.description ?? '',
    image_url: initial?.image_url ?? '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof EMPTY_PRODUCT, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Nom" required>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
      </Field>
      <Field label="Catégorie">
        <select value={form.category} onChange={(e) => set('category', e.target.value as ProductCategory)}>
          <option value="TCG">TCG</option>
          <option value="BOARD_GAME">Jeu de société</option>
          <option value="ACCESSORY">Accessoire</option>
        </select>
      </Field>
      <Field label="Prix (€)" required>
        <input type="number" step="0.01" min="0" value={form.price}
          onChange={(e) => set('price', parseFloat(e.target.value) || 0)} required />
      </Field>
      <Field label="Stock">
        <input type="number" min="0" value={form.stock}
          onChange={(e) => set('stock', parseInt(e.target.value) || 0)} />
      </Field>
      <ImagePicker
        value={form.image_url}
        onChange={(url) => set('image_url', url)}
      />
      <Field label="Description" className="sm:col-span-2">
        <textarea rows={3} value={form.description ?? ''}
          onChange={(e) => set('description', e.target.value)} />
      </Field>
      <div className="sm:col-span-2 flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}

// ─── Tournament form ─────────────────────────────────────────────────────────

const EMPTY_TOURNAMENT = {
  name: '', game: '', date: '', max_players: 16,
  entry_fee: 0, status: 'UPCOMING' as TournamentStatus,
}

function TournamentForm({
  initial, onSave, onCancel,
}: {
  initial?: Partial<Tournament>
  onSave: (data: typeof EMPTY_TOURNAMENT) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    ...EMPTY_TOURNAMENT,
    ...initial,
    date: initial?.date ? initial.date.slice(0, 16) : '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof EMPTY_TOURNAMENT, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Nom" required>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
      </Field>
      <Field label="Jeu" required>
        <input value={form.game} onChange={(e) => set('game', e.target.value)} required />
      </Field>
      <Field label="Date">
        <input type="datetime-local" value={form.date} onChange={(e) => set('date', e.target.value)} />
      </Field>
      <Field label="Max joueurs">
        <input type="number" min="2" value={form.max_players}
          onChange={(e) => set('max_players', parseInt(e.target.value) || 0)} />
      </Field>
      <Field label="Frais d'entrée (€)">
        <input type="number" step="0.01" min="0" value={form.entry_fee}
          onChange={(e) => set('entry_fee', parseFloat(e.target.value) || 0)} />
      </Field>
      <Field label="Statut">
        <select value={form.status} onChange={(e) => set('status', e.target.value as TournamentStatus)}>
          <option value="UPCOMING">À venir</option>
          <option value="ONGOING">En cours</option>
          <option value="COMPLETED">Terminé</option>
        </select>
      </Field>
      <div className="sm:col-span-2 flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}

// ─── Shared field wrapper ─────────────────────────────────────────────────────

function Field({ label, required, className, children }: {
  label: string; required?: boolean; className?: string; children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label className="block font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase text-white/50 mb-1.5">
        {label}{required && ' *'}
      </label>
      <div className="[&_input]:field [&_select]:field [&_textarea]:field">{children}</div>
    </div>
  )
}

// ─── Main admin page ──────────────────────────────────────────────────────────

type Tab = 'products' | 'tournaments'

export default function AdminPage() {
  const { user } = useAuthStore()
  const { products, load: loadProducts } = useProductStore()
  const { tournaments, load: loadTournaments } = useTournamentStore()
  const isVendor = user?.role === 'VENDOR'

  const [tab, setTab] = useState<Tab>('products')
  const [editingProduct, setEditingProduct] = useState<Product | null | 'new'>(null)
  const [editingTournament, setEditingTournament] = useState<Tournament | null | 'new'>(null)
  const [error, setError] = useState('')

  useEffect(() => { loadProducts(); loadTournaments() }, [loadProducts, loadTournaments])

  // Products CRUD
  const saveProduct = async (data: typeof EMPTY_PRODUCT) => {
    setError('')
    try {
      if (editingProduct === 'new') {
        await client.post('/products', data)
      } else if (editingProduct) {
        await client.put(`/products/${editingProduct.id}`, data)
      }
      await loadProducts()
      setEditingProduct(null)
    } catch {
      setError('Une erreur est survenue.')
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      await client.delete(`/products/${id}`)
      await loadProducts()
    } catch {
      setError('Impossible de supprimer.')
    }
  }

  // Tournaments CRUD
  const saveTournament = async (data: typeof EMPTY_TOURNAMENT) => {
    setError('')
    try {
      if (editingTournament === 'new') {
        await client.post('/tournaments', data)
      } else if (editingTournament) {
        await client.put(`/tournaments/${editingTournament.id}`, data)
      }
      await loadTournaments()
      setEditingTournament(null)
    } catch {
      setError('Une erreur est survenue.')
    }
  }

  const deleteTournament = async (id: number) => {
    if (!confirm('Supprimer ce tournoi ?')) return
    try {
      await client.delete(`/tournaments/${id}`)
      await loadTournaments()
    } catch {
      setError('Impossible de supprimer.')
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <div className="bg-navy-light border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex items-center justify-between">
          <div>
            <p className="font-condensed font-bold text-[0.7rem] tracking-[0.2em] uppercase text-yellow mb-0.5">
              {isVendor ? 'Vendeur' : 'Administration'}
            </p>
            <h1 className="font-condensed font-black text-2xl uppercase tracking-wide text-white">
              {isVendor ? 'Mes produits' : 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="font-condensed font-bold text-[0.72rem] tracking-[0.12em] uppercase text-white/40 hover:text-yellow transition-colors">
              ← Voir le site
            </a>
            <p className="font-condensed text-sm text-white/40">
              <span className="text-white">{user?.username}</span>
              {user?.role && (
                <span className="ml-2 font-condensed font-bold text-[0.6rem] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded bg-yellow/20 text-yellow">
                  {user.role}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Produits', value: products.length },
            ...(!isVendor ? [
              { label: 'Tournois', value: tournaments.length },
              { label: 'À venir', value: tournaments.filter(t => t.status === 'UPCOMING').length },
              { label: 'En cours', value: tournaments.filter(t => t.status === 'ONGOING').length },
            ] : []),
          ].map(({ label, value }) => (
            <div key={label} className="bg-navy-light border border-white/10 rounded-lg p-4">
              <p className="font-condensed font-bold text-[0.65rem] tracking-[0.15em] uppercase text-white/40 mb-1">{label}</p>
              <p className="font-condensed font-black text-3xl text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs — vendeur voit uniquement Produits */}
        {!isVendor && (
          <div className="flex gap-1 mb-6 border-b border-white/10">
            {(['products', 'tournaments'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`font-condensed font-bold text-sm tracking-widest uppercase px-6 py-3 border-b-[3px] -mb-px transition-colors ${
                  tab === t ? 'text-yellow border-yellow' : 'text-white/40 border-transparent hover:text-white'
                }`}
              >
                {t === 'products' ? 'Produits' : 'Tournois'}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {/* Products tab */}
        {tab === 'products' && (
          <div>
            {editingProduct ? (
              <div className="bg-navy-light border border-white/10 rounded-lg p-6 mb-6">
                <h2 className="font-condensed font-black text-lg uppercase tracking-wide text-white mb-4">
                  {editingProduct === 'new' ? 'Nouveau produit' : 'Modifier le produit'}
                </h2>
                <ProductForm
                  initial={editingProduct === 'new' ? undefined : editingProduct}
                  onSave={saveProduct}
                  onCancel={() => setEditingProduct(null)}
                />
              </div>
            ) : (
              <button onClick={() => setEditingProduct('new')} className="btn-primary mb-6">
                + Ajouter un produit
              </button>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Nom', 'Catégorie', 'Prix', 'Stock', 'Actions'].map((h) => (
                      <th key={h} className="font-condensed font-bold text-[0.68rem] tracking-[0.15em] uppercase text-white/40 text-left py-3 px-3 first:pl-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 pl-0 text-white text-sm font-medium">{p.name}</td>
                      <td className="py-3 px-3 text-white/50 text-sm">{p.category}</td>
                      <td className="py-3 px-3 text-white/70 text-sm">{p.price.toFixed(2)} €</td>
                      <td className="py-3 px-3">
                        <span className={`font-condensed font-bold text-xs px-2 py-0.5 rounded ${
                          p.stock === 0 ? 'bg-red-500/20 text-red-400' :
                          p.stock < 5 ? 'bg-yellow/20 text-yellow' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button onClick={() => setEditingProduct(p)} className="text-white/40 hover:text-white text-xs font-condensed font-bold uppercase tracking-wider transition-colors">
                            Modifier
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="text-red-400/60 hover:text-red-400 text-xs font-condensed font-bold uppercase tracking-wider transition-colors">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-white/30 text-sm">Aucun produit</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tournaments tab */}
        {tab === 'tournaments' && (
          <div>
            {editingTournament ? (
              <div className="bg-navy-light border border-white/10 rounded-lg p-6 mb-6">
                <h2 className="font-condensed font-black text-lg uppercase tracking-wide text-white mb-4">
                  {editingTournament === 'new' ? 'Nouveau tournoi' : 'Modifier le tournoi'}
                </h2>
                <TournamentForm
                  initial={editingTournament === 'new' ? undefined : editingTournament}
                  onSave={saveTournament}
                  onCancel={() => setEditingTournament(null)}
                />
              </div>
            ) : (
              <button onClick={() => setEditingTournament('new')} className="btn-primary mb-6">
                + Ajouter un tournoi
              </button>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Nom', 'Jeu', 'Date', 'Places', 'Statut', 'Actions'].map((h) => (
                      <th key={h} className="font-condensed font-bold text-[0.68rem] tracking-[0.15em] uppercase text-white/40 text-left py-3 px-3 first:pl-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map((t) => (
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 pl-0 text-white text-sm font-medium">{t.name}</td>
                      <td className="py-3 px-3 text-white/50 text-sm">{t.game}</td>
                      <td className="py-3 px-3 text-white/50 text-sm">
                        {new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-3 text-white/50 text-sm">
                        {t.registered_players}/{t.max_players}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-condensed font-bold text-xs px-2 py-0.5 rounded ${
                          t.status === 'UPCOMING' ? 'bg-yellow/20 text-yellow' :
                          t.status === 'ONGOING' ? 'bg-green-500/20 text-green-400' :
                          'bg-white/10 text-white/40'
                        }`}>
                          {t.status === 'UPCOMING' ? 'À venir' : t.status === 'ONGOING' ? 'En cours' : 'Terminé'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button onClick={() => setEditingTournament(t)} className="text-white/40 hover:text-white text-xs font-condensed font-bold uppercase tracking-wider transition-colors">
                            Modifier
                          </button>
                          <button onClick={() => deleteTournament(t.id)} className="text-red-400/60 hover:text-red-400 text-xs font-condensed font-bold uppercase tracking-wider transition-colors">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tournaments.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-white/30 text-sm">Aucun tournoi</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

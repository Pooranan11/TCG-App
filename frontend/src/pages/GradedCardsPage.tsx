import { useEffect, useState } from 'react'
import { useGradedCardStore } from '../store/gradedCardStore'
import GradedCardCard from '../components/GradedCardCard'
import type { GradingCompany } from '../types'

const COMPANIES: GradingCompany[] = ['PSA', 'BGS', 'CGC']

export default function GradedCardsPage() {
  const { cards, loading, error, load } = useGradedCardStore()
  const [search, setSearch] = useState('')
  const [company, setCompany] = useState<GradingCompany | ''>('')
  const [minGrade, setMinGrade] = useState('')

  useEffect(() => { load() }, [])

  const filtered = cards.filter((c) => {
    if (search && !c.card_name.toLowerCase().includes(search.toLowerCase()) &&
        !c.set_name.toLowerCase().includes(search.toLowerCase())) return false
    if (company && c.grading_company !== company) return false
    if (minGrade && parseFloat(c.grade) < parseFloat(minGrade)) return false
    return true
  })

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="font-condensed font-bold text-[0.7rem] tracking-[0.2em] uppercase text-yellow mb-0.5">
          Collection
        </p>
        <h1 className="font-condensed font-black text-3xl uppercase text-navy">
          Cartes Gradées Pokémon
        </h1>
        <p className="text-muted text-sm mt-2">
          Cartes certifiées et gradées par PSA, BGS et CGC.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Rechercher une carte, un set…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-white border border-navy/15 text-navy placeholder-navy/30 px-4 py-2 text-sm rounded focus:outline-none focus:border-yellow transition-colors"
        />
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value as GradingCompany | '')}
          className="bg-white border border-navy/15 text-navy px-4 py-2 text-sm rounded focus:outline-none focus:border-yellow transition-colors"
        >
          <option value="">Toutes les sociétés</option>
          {COMPANIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={minGrade}
          onChange={(e) => setMinGrade(e.target.value)}
          className="bg-white border border-navy/15 text-navy px-4 py-2 text-sm rounded focus:outline-none focus:border-yellow transition-colors"
        >
          <option value="">Grade minimum</option>
          {['7', '8', '9', '9.5', '10'].map((g) => (
            <option key={g} value={g}>≥ {g}</option>
          ))}
        </select>
      </div>

      {/* States */}
      {loading && <p className="text-muted text-sm">Chargement...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && filtered.length === 0 && !error && (
        <div className="text-center py-16">
          <p className="font-condensed font-bold text-lg uppercase text-navy/30">
            Aucune carte trouvée
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filtered.map((card) => (
          <GradedCardCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}

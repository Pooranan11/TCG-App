import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchGradedCard } from '../api/gradedCards'
import { useCartStore } from '../store/cartStore'
import type { GradedCard } from '../types'
import { GRADING_COMPANY_STYLE, GRADE_COLOR } from '../utils/labels'

export default function GradedCardPage() {
  const { id } = useParams<{ id: string }>()
  const addGradedCard = useCartStore((s) => s.addGradedCard)
  const [card, setCard] = useState<GradedCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchGradedCard(Number(id))
      .then((c) => { setCard(c); setLoading(false) })
      .catch(() => { setError('Carte introuvable.'); setLoading(false) })
  }, [id])

  const handleAdd = () => {
    if (!card) return
    addGradedCard(card)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <p className="text-muted text-sm">Chargement...</p>
    </div>
  )

  if (error || !card) return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <p className="text-red-500 text-sm mb-4">{error || 'Carte introuvable.'}</p>
      <Link to="/graded-cards" className="font-condensed font-bold text-sm text-navy hover:text-yellow transition-colors">
        ← Retour aux cartes gradées
      </Link>
    </div>
  )

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <Link
        to="/graded-cards"
        className="inline-flex items-center gap-1.5 font-condensed font-bold text-[0.78rem] tracking-[0.1em] uppercase text-muted hover:text-navy transition-colors mb-8"
      >
        ← Cartes gradées
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image */}
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg aspect-[3/4] flex items-center justify-center overflow-hidden relative">
          {card.image_url ? (
            <img src={card.image_url} alt={card.card_name} className="w-full h-full object-contain p-8" />
          ) : (
            <svg width="96" height="96" viewBox="0 0 48 48" fill="none" className="opacity-20">
              <rect x="8" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(-8 8 6)" />
              <rect x="18" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(6 18 6)" />
            </svg>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Grade badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`font-condensed font-black text-sm tracking-widest uppercase px-3 py-1 rounded ${GRADING_COMPANY_STYLE[card.grading_company]}`}>
              {card.grading_company}
            </span>
            <span className={`font-condensed font-black text-4xl ${GRADE_COLOR(card.grade)}`}>
              {card.grade}
            </span>
          </div>

          <h1 className="font-condensed font-black text-3xl sm:text-4xl uppercase text-navy leading-tight mb-2">
            {card.card_name}
          </h1>

          <p className="text-muted text-sm mb-1">
            <span className="font-semibold text-navy/70">{card.set_name}</span> · #{card.card_number}
          </p>

          {card.cert_number && (
            <p className="text-muted text-xs font-mono mb-6">
              Cert. #{card.cert_number}
            </p>
          )}

          {card.description && (
            <p className="text-muted text-sm leading-relaxed mb-6">{card.description}</p>
          )}

          <div className="flex items-baseline gap-1 mb-2">
            <span className="font-condensed font-black text-4xl text-navy">
              {card.price.toFixed(2)}
            </span>
            <span className="font-condensed font-bold text-lg text-muted">€</span>
          </div>

          <p className={`font-condensed font-bold text-[0.72rem] tracking-[0.1em] uppercase mb-8 ${
            card.stock === 0 ? 'text-red-500' : 'text-green-600'
          }`}>
            {card.stock === 0 ? 'Vendu' : 'Disponible'}
          </p>

          {card.stock > 0 && (
            <button
              onClick={handleAdd}
              className={`font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase py-3 px-6 transition-all ${
                added ? 'bg-green-500 text-white' : 'bg-yellow text-navy hover:bg-yellow-light'
              }`}
            >
              {added ? 'Ajouté !' : 'Ajouter au panier'}
            </button>
          )}

          <Link
            to="/cart"
            className="font-condensed font-bold text-[0.72rem] tracking-[0.12em] uppercase text-muted hover:text-navy transition-colors self-start mt-4"
          >
            Voir le panier →
          </Link>
        </div>
      </div>
    </div>
  )
}

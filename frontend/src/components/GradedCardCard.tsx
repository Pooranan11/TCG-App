import { Link } from 'react-router-dom'
import type { GradedCard } from '../types'
import { GRADING_COMPANY_STYLE, GRADE_COLOR } from '../utils/labels'

interface Props {
  card: GradedCard
}

export default function GradedCardCard({ card }: Props) {
  return (
    <Link
      to={`/graded-cards/${card.id}`}
      className="bg-white rounded-lg overflow-hidden border border-navy/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10 hover:border-yellow group flex flex-col"
    >
      {/* Image */}
      <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.card_name}
            className="h-full w-full object-contain p-3"
          />
        ) : (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-20">
            <rect x="8" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(-8 8 6)" />
            <rect x="18" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(6 18 6)" />
          </svg>
        )}
        {/* Grade badge */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <span className={`font-condensed font-black text-[0.6rem] tracking-widest uppercase px-2 py-0.5 rounded ${GRADING_COMPANY_STYLE[card.grading_company]}`}>
            {card.grading_company}
          </span>
          <span className={`font-condensed font-black text-xl leading-none bg-navy/80 px-2 py-1 rounded ${GRADE_COLOR(card.grade)}`}>
            {card.grade}
          </span>
        </div>
        {card.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="font-condensed font-black text-white text-sm uppercase tracking-widest">Vendu</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="font-condensed font-black text-[0.95rem] uppercase text-navy leading-tight mb-1 line-clamp-2">
          {card.card_name}
        </p>
        <p className="text-[0.72rem] text-muted mb-3">
          {card.set_name} · #{card.card_number}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-condensed font-black text-xl text-navy">
            {card.price.toFixed(2)} <span className="text-sm font-semibold text-muted">€</span>
          </span>
          {card.cert_number && (
            <span className="text-[0.65rem] text-muted font-mono">#{card.cert_number}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

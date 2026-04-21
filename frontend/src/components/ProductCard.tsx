import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { CATEGORY_LABELS } from '../utils/labels'

const CATEGORY_BG: Record<string, string> = {
  TCG: 'bg-gradient-to-br from-blue-100 to-blue-200',
  BOARD_GAME: 'bg-gradient-to-br from-amber-50 to-amber-100',
  ACCESSORY: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
}

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Link to={`/products/${product.id}`} className="bg-white rounded-lg overflow-hidden border border-navy/10 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10 hover:border-yellow group">
      <div className={`aspect-[4/3] flex items-center justify-center relative ${CATEGORY_BG[product.category] ?? 'bg-light'}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
            <rect x="8" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(-8 8 6)" />
            <rect x="18" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(6 18 6)" />
          </svg>
        )}
        <span className="absolute top-2 left-2 font-condensed font-black text-[0.6rem] tracking-[0.12em] uppercase bg-yellow text-navy px-2 py-0.5">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>
      </div>
      <div className="p-4">
        <p className="font-condensed font-black text-[1rem] uppercase text-navy leading-tight mb-2">
          {product.name}
        </p>
        {product.description && (
          <p className="text-[0.78rem] text-muted line-clamp-2 mb-3 font-light leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-condensed font-black text-xl text-navy">
            {product.price.toFixed(2)} <span className="text-sm font-semibold text-muted">€</span>
          </span>
          <span className="text-[0.65rem] text-muted">Stock : {product.stock}</span>
        </div>
      </div>
    </Link>
  )
}

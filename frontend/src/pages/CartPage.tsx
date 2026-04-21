import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { createOrder } from '../api/orders'
import { GRADING_COMPANY_STYLE } from '../utils/labels'

export default function CartPage() {
  const { items, remove, update, clear, total, count } = useCartStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setLoading(true)
    setError('')
    try {
      await createOrder({
        items: items.map((i) =>
          i.type === 'product'
            ? { product_id: i.product.id, quantity: i.quantity }
            : { graded_card_id: i.card.id, quantity: 1 },
        ),
      })
      clear()
      navigate('/orders')
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(detail ?? 'Une erreur est survenue lors de la commande.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 text-center">
        <p className="font-condensed font-black text-2xl uppercase text-navy/30 mb-6">
          Votre panier est vide
        </p>
        <Link
          to="/products"
          className="inline-block font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy px-8 py-3 hover:bg-yellow-light transition-colors"
        >
          Voir le catalogue
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <div className="mb-8">
        <p className="font-condensed font-bold text-[0.7rem] tracking-[0.2em] uppercase text-yellow mb-0.5">
          Boutique
        </p>
        <h1 className="font-condensed font-black text-3xl uppercase text-navy">
          Votre panier
          <span className="text-muted font-semibold text-xl ml-3 normal-case tracking-normal">
            ({count()} article{count() > 1 ? 's' : ''})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => {
            if (item.type === 'product') {
              const { product, quantity } = item
              return (
                <div
                  key={`product-${product.id}`}
                  className="flex gap-4 bg-white border border-navy/10 rounded-lg p-4 items-center"
                >
                  <div className="w-16 h-16 bg-light rounded flex items-center justify-center shrink-0 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="opacity-20">
                        <rect x="8" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(-8 8 6)" />
                        <rect x="18" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(6 18 6)" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${product.id}`}
                      className="font-condensed font-black text-[0.95rem] uppercase text-navy leading-tight hover:text-yellow transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-[0.75rem] text-muted mt-0.5">
                      {product.price.toFixed(2)} € / unité
                    </p>
                  </div>
                  <div className="flex items-center border border-navy/20 shrink-0">
                    <button
                      onClick={() => update(product.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-navy font-bold hover:bg-navy/5 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center font-condensed font-black text-navy text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => update(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center text-navy font-bold hover:bg-navy/5 transition-colors disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-condensed font-black text-navy shrink-0 w-20 text-right">
                    {(product.price * quantity).toFixed(2)} €
                  </span>
                  <button
                    onClick={() => remove(String(product.id))}
                    className="text-muted hover:text-red-500 transition-colors ml-1 shrink-0"
                    aria-label="Supprimer"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              )
            }

            // Graded card
            const { card } = item
            return (
              <div
                key={`graded-${card.id}`}
                className="flex gap-4 bg-white border border-navy/10 rounded-lg p-4 items-center"
              >
                <div className="w-16 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded flex items-center justify-center shrink-0 overflow-hidden relative">
                  {card.image_url ? (
                    <img src={card.image_url} alt={card.card_name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="opacity-20">
                      <rect x="8" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(-8 8 6)" />
                      <rect x="18" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(6 18 6)" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-condensed font-black text-[0.55rem] tracking-widest uppercase px-1.5 py-0.5 rounded ${GRADING_COMPANY_STYLE[card.grading_company]}`}>
                      {card.grading_company}
                    </span>
                    <span className="font-condensed font-black text-sm text-navy">
                      {card.grade}
                    </span>
                  </div>
                  <Link
                    to={`/graded-cards/${card.id}`}
                    className="font-condensed font-black text-[0.95rem] uppercase text-navy leading-tight hover:text-yellow transition-colors line-clamp-1"
                  >
                    {card.card_name}
                  </Link>
                  <p className="text-[0.72rem] text-muted mt-0.5">
                    {card.set_name} · #{card.card_number}
                  </p>
                </div>
                <span className="font-condensed font-black text-navy shrink-0 w-20 text-right">
                  {card.price.toFixed(2)} €
                </span>
                <button
                  onClick={() => remove(String(card.id))}
                  className="text-muted hover:text-red-500 transition-colors ml-1 shrink-0"
                  aria-label="Supprimer"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )
          })}

          <button
            onClick={clear}
            className="font-condensed font-bold text-[0.72rem] tracking-[0.1em] uppercase text-muted hover:text-red-500 transition-colors self-start mt-2"
          >
            Vider le panier
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-navy text-white rounded-lg p-6 sticky top-24">
            <h2 className="font-condensed font-black text-lg uppercase tracking-wide mb-5 border-b border-white/10 pb-4">
              Récapitulatif
            </h2>
            <div className="flex flex-col gap-2 mb-5 text-sm">
              {items.map((item) => {
                if (item.type === 'product') {
                  return (
                    <div key={`product-${item.product.id}`} className="flex justify-between text-white/60">
                      <span className="truncate mr-2">{item.product.name} ×{item.quantity}</span>
                      <span className="shrink-0">{(item.product.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  )
                }
                return (
                  <div key={`graded-${item.card.id}`} className="flex justify-between text-white/60">
                    <span className="truncate mr-2">{item.card.card_name} ({item.card.grading_company} {item.card.grade})</span>
                    <span className="shrink-0">{item.card.price.toFixed(2)} €</span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-white/10 pt-4 flex justify-between items-baseline mb-6">
              <span className="font-condensed font-bold text-[0.78rem] tracking-[0.1em] uppercase text-white/50">
                Total
              </span>
              <span className="font-condensed font-black text-2xl text-yellow">
                {total().toFixed(2)} €
              </span>
            </div>

            {error && (
              <p className="text-red-400 text-[0.78rem] mb-4">{error}</p>
            )}

            {user ? (
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy py-3 hover:bg-yellow-light transition-colors disabled:opacity-60"
              >
                {loading ? 'Commande en cours...' : 'Commander'}
              </button>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy py-3 hover:bg-yellow-light transition-colors"
              >
                Se connecter pour commander
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

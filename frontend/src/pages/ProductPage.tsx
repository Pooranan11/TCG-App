import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct } from '../api/products'
import { useCartStore } from '../store/cartStore'
import type { Product } from '../types'
import { CATEGORY_LABELS } from '../utils/labels'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const add = useCartStore((s) => s.add)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchProduct(Number(id))
      .then((p) => { setProduct(p); setLoading(false) })
      .catch(() => { setError('Produit introuvable.'); setLoading(false) })
  }, [id])

  const handleAdd = () => {
    if (!product) return
    add(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <p className="text-muted text-sm">Chargement...</p>
    </div>
  )

  if (error || !product) return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <p className="text-red-500 text-sm mb-4">{error || 'Produit introuvable.'}</p>
      <Link to="/products" className="font-condensed font-bold text-sm text-navy hover:text-yellow transition-colors">
        ← Retour au catalogue
      </Link>
    </div>
  )

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 font-condensed font-bold text-[0.78rem] tracking-[0.1em] uppercase text-muted hover:text-navy transition-colors mb-8"
      >
        ← Catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image */}
        <div className="bg-light rounded-lg aspect-square flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-8" />
          ) : (
            <svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
              <rect x="8" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(-8 8 6)" />
              <rect x="18" y="6" width="22" height="30" rx="3" fill="#1A2B5E" transform="rotate(6 18 6)" />
            </svg>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="font-condensed font-black text-[0.68rem] tracking-[0.18em] uppercase text-yellow bg-navy inline-block px-2 py-0.5 self-start mb-3">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>

          <h1 className="font-condensed font-black text-3xl sm:text-4xl uppercase text-navy leading-tight mb-4">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-muted text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="flex items-baseline gap-1 mb-2">
            <span className="font-condensed font-black text-4xl text-navy">
              {product.price.toFixed(2)}
            </span>
            <span className="font-condensed font-bold text-lg text-muted">€</span>
          </div>

          <p className={`font-condensed font-bold text-[0.72rem] tracking-[0.1em] uppercase mb-8 ${
            product.stock === 0 ? 'text-red-500' :
            product.stock < 5 ? 'text-yellow-dark' :
            'text-green-600'
          }`}>
            {product.stock === 0 ? 'Rupture de stock' :
             product.stock < 5 ? `Plus que ${product.stock} en stock` :
             `En stock (${product.stock})`}
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              {/* Quantity selector */}
              <div className="flex items-center border-2 border-navy/20">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-navy font-bold text-lg hover:bg-navy/5 transition-colors"
                >
                  −
                </button>
                <span className="w-10 h-10 flex items-center justify-center font-condensed font-black text-navy">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-navy font-bold text-lg hover:bg-navy/5 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase py-3 px-6 transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow text-navy hover:bg-yellow-light'
                }`}
              >
                {added ? 'Ajouté !' : 'Ajouter au panier'}
              </button>
            </div>
          )}

          <Link
            to="/cart"
            className="font-condensed font-bold text-[0.72rem] tracking-[0.12em] uppercase text-muted hover:text-navy transition-colors self-start"
          >
            Voir le panier →
          </Link>
        </div>
      </div>
    </div>
  )
}

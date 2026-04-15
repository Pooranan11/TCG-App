import { useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import { useProductStore } from '../store/productStore'
import type { ProductCategory } from '../types'

const CATEGORIES: { value: ProductCategory | null; label: string }[] = [
  { value: null, label: 'Tous' },
  { value: 'TCG', label: 'Cartes TCG' },
  { value: 'BOARD_GAME', label: 'Jeux de societe' },
  { value: 'ACCESSORY', label: 'Accessoires' },
]

export default function ProductsPage() {
  const { products, loading, error, selectedCategory, load, setCategory } = useProductStore()

  useEffect(() => { load() }, [load])

  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <SectionHeader tag="Boutique" title="Catalogue" />

      {/* Filters — scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 mb-6 sm:mb-10">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={String(value)}
              onClick={() => setCategory(value)}
              className={`font-condensed font-bold text-[0.8rem] tracking-[0.1em] uppercase px-4 sm:px-5 py-2 border-2 transition-colors whitespace-nowrap ${
                selectedCategory === value
                  ? 'bg-navy text-yellow border-navy'
                  : 'bg-transparent text-navy border-navy/20 hover:border-yellow hover:text-yellow-dark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-muted text-sm">Chargement...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-muted text-center py-16 font-condensed font-bold text-lg uppercase tracking-wide">
          Aucun produit dans cette categorie
        </p>
      )}
    </div>
  )
}

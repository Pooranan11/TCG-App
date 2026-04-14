import { useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import { useProductStore } from '../store/productStore'
import type { ProductCategory } from '../types'

const CATEGORIES: { value: ProductCategory | null; label: string }[] = [
  { value: null, label: 'Tous les produits' },
  { value: 'TCG', label: 'Jeux de cartes' },
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SectionHeader tag="Boutique" title="Catalogue" />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-10">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={String(value)}
            onClick={() => setCategory(value)}
            className={`font-condensed font-bold text-[0.8rem] tracking-[0.1em] uppercase px-5 py-2 border-2 transition-colors ${
              selectedCategory === value
                ? 'bg-navy text-yellow border-navy'
                : 'bg-transparent text-navy border-navy/20 hover:border-yellow hover:text-yellow-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted text-sm">Chargement...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

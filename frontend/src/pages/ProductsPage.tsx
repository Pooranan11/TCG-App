import { useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { useProductStore } from '../store/productStore'
import type { ProductCategory } from '../types'

const CATEGORIES: { value: ProductCategory | null; label: string }[] = [
  { value: null, label: 'Tous' },
  { value: 'TCG', label: 'Jeux de cartes' },
  { value: 'BOARD_GAME', label: 'Jeux de société' },
  { value: 'ACCESSORY', label: 'Accessoires' },
]

export default function ProductsPage() {
  const { products, loading, error, selectedCategory, load, setCategory } = useProductStore()

  useEffect(() => {
    load()
  }, [load])

  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Catalogue</h1>

      <div className="flex gap-3 flex-wrap mb-8">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={String(value)}
            onClick={() => setCategory(value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              selectedCategory === value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-blue-200 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-blue-400">Chargement…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-blue-300 text-center py-12">Aucun produit dans cette catégorie.</p>
      )}
    </div>
  )
}

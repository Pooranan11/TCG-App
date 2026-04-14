import type { Product } from '../types'

const CATEGORY_LABELS: Record<string, string> = {
  TCG: 'Jeu de cartes',
  BOARD_GAME: 'Jeu de société',
  ACCESSORY: 'Accessoire',
}

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          'Pas d\'image'
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>
        <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)} €</span>
          <span className="text-xs text-gray-500">Stock : {product.stock}</span>
        </div>
      </div>
    </div>
  )
}

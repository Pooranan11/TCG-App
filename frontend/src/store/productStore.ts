import { create } from 'zustand'
import { fetchProducts } from '../api/products'
import type { Product, ProductCategory } from '../types'

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  selectedCategory: ProductCategory | null
  load: () => Promise<void>
  setCategory: (category: ProductCategory | null) => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  selectedCategory: null,

  load: async () => {
    set({ loading: true, error: null })
    try {
      const products = await fetchProducts()
      set({ products, loading: false })
    } catch {
      set({ error: 'Erreur lors du chargement des produits', loading: false })
    }
  },

  setCategory: (category) => set({ selectedCategory: category }),
}))

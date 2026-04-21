import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GradedCard, Product } from '../types'

export type CartItem =
  | { type: 'product'; product: Product; quantity: number }
  | { type: 'graded_card'; card: GradedCard }

interface CartState {
  items: CartItem[]
  add: (product: Product, quantity?: number) => void
  addGradedCard: (card: GradedCard) => void
  remove: (key: string) => void
  update: (productId: number, quantity: number) => void
  clear: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product, quantity = 1) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.type === 'product' && i.product.id === product.id,
          ) as { type: 'product'; product: Product; quantity: number } | undefined
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.type === 'product' && i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            }
          }
          return { items: [...s.items, { type: 'product', product, quantity }] }
        }),

      addGradedCard: (card) =>
        set((s) => {
          const already = s.items.some(
            (i) => i.type === 'graded_card' && i.card.id === card.id,
          )
          if (already) return s
          return { items: [...s.items, { type: 'graded_card', card }] }
        }),

      remove: (key) =>
        set((s) => ({
          items: s.items.filter((i) => {
            if (i.type === 'product') return String(i.product.id) !== key
            return String(i.card.id) !== key
          }),
        })),

      update: (productId, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter(
                  (i) => !(i.type === 'product' && i.product.id === productId),
                )
              : s.items.map((i) =>
                  i.type === 'product' && i.product.id === productId
                    ? { ...i, quantity }
                    : i,
                ),
        })),

      clear: () => set({ items: [] }),

      total: () =>
        get().items.reduce((acc, i) => {
          if (i.type === 'product') return acc + i.product.price * i.quantity
          return acc + i.card.price
        }, 0),

      count: () =>
        get().items.reduce((acc, i) => {
          if (i.type === 'product') return acc + i.quantity
          return acc + 1
        }, 0),
    }),
    { name: 'cart' },
  ),
)

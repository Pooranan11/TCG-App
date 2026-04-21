import { create } from 'zustand'
import { fetchGradedCards } from '../api/gradedCards'
import type { GradedCard } from '../types'

interface GradedCardState {
  cards: GradedCard[]
  loading: boolean
  error: string | null
  load: () => Promise<void>
}

export const useGradedCardStore = create<GradedCardState>((set) => ({
  cards: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null })
    try {
      const cards = await fetchGradedCards()
      set({ cards, loading: false })
    } catch {
      set({ error: 'Erreur lors du chargement des cartes gradées', loading: false })
    }
  },
}))

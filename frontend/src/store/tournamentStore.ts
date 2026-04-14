import { create } from 'zustand'
import { fetchTournaments, registerForTournament } from '../api/tournaments'
import type { Tournament } from '../types'

interface TournamentState {
  tournaments: Tournament[]
  loading: boolean
  error: string | null
  load: () => Promise<void>
  register: (tournamentId: number, playerId: string) => Promise<void>
}

export const useTournamentStore = create<TournamentState>((set, get) => ({
  tournaments: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null })
    try {
      const tournaments = await fetchTournaments()
      set({ tournaments, loading: false })
    } catch {
      set({ error: 'Erreur lors du chargement des tournois', loading: false })
    }
  },

  register: async (tournamentId, playerId) => {
    try {
      const updated = await registerForTournament(tournamentId, playerId)
      set({
        tournaments: get().tournaments.map((t) =>
          t.id === tournamentId ? updated : t,
        ),
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erreur lors de l\'inscription'
      set({ error: message })
    }
  },
}))

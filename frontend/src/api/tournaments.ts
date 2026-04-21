import type { Tournament } from '../types'
import client from './client'

export const fetchTournaments = (): Promise<Tournament[]> =>
  client.get<Tournament[]>('/tournaments').then((r) => r.data)

export const registerForTournament = (tournamentId: number): Promise<Tournament> =>
  client.post<Tournament>(`/tournaments/${tournamentId}/register`).then((r) => r.data)

export const createTournament = (data: Omit<Tournament, 'id' | 'created_at' | 'registered_players'>): Promise<Tournament> =>
  client.post<Tournament>('/tournaments', data).then((r) => r.data)

export const updateTournament = (id: number, data: Omit<Tournament, 'id' | 'created_at' | 'registered_players'>): Promise<Tournament> =>
  client.put<Tournament>(`/tournaments/${id}`, data).then((r) => r.data)

export const deleteTournament = (id: number): Promise<void> =>
  client.delete(`/tournaments/${id}`).then(() => undefined)

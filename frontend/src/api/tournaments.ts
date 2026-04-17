import type { Tournament } from '../types'
import client from './client'

export const fetchTournaments = (): Promise<Tournament[]> =>
  client.get<Tournament[]>('/tournaments').then((r) => r.data)

export const registerForTournament = (tournamentId: number): Promise<Tournament> =>
  client.post<Tournament>(`/tournaments/${tournamentId}/register`).then((r) => r.data)

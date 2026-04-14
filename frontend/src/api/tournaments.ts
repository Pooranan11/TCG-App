import type { Tournament } from '../types'
import client from './client'

export const fetchTournaments = (): Promise<Tournament[]> =>
  client.get<Tournament[]>('/tournaments').then((r) => r.data)

export const registerForTournament = (
  tournamentId: number,
  playerId: string,
): Promise<Tournament> =>
  client
    .post<Tournament>(`/tournaments/${tournamentId}/register`, null, {
      params: { player_id: playerId },
    })
    .then((r) => r.data)

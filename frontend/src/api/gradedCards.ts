import type { GradedCard } from '../types'
import client from './client'

export const fetchGradedCards = (): Promise<GradedCard[]> =>
  client.get<GradedCard[]>('/graded-cards').then((r) => r.data)

export const fetchGradedCard = (id: number): Promise<GradedCard> =>
  client.get<GradedCard>(`/graded-cards/${id}`).then((r) => r.data)

export const createGradedCard = (data: Omit<GradedCard, 'id' | 'created_at'>): Promise<GradedCard> =>
  client.post<GradedCard>('/graded-cards', data).then((r) => r.data)

export const updateGradedCard = (id: number, data: Omit<GradedCard, 'id' | 'created_at'>): Promise<GradedCard> =>
  client.put<GradedCard>(`/graded-cards/${id}`, data).then((r) => r.data)

export const deleteGradedCard = (id: number): Promise<void> =>
  client.delete(`/graded-cards/${id}`).then(() => undefined)

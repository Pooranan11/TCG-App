import type { Order } from '../types'
import client from './client'

export interface OrderPayload {
  items: { product_id: number; quantity: number }[]
}

export const createOrder = (data: OrderPayload): Promise<Order> =>
  client.post<Order>('/orders', data).then((r) => r.data)

export const fetchMyOrders = (): Promise<Order[]> =>
  client.get<Order[]>('/orders/me').then((r) => r.data)

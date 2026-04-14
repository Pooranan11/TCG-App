import type { Product } from '../types'
import client from './client'

export const fetchProducts = (): Promise<Product[]> =>
  client.get<Product[]>('/products').then((r) => r.data)

export const fetchProduct = (id: number): Promise<Product> =>
  client.get<Product>(`/products/${id}`).then((r) => r.data)

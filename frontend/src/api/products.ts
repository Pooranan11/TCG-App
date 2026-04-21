import type { Product } from '../types'
import client from './client'

export const fetchProducts = (): Promise<Product[]> =>
  client.get<Product[]>('/products').then((r) => r.data)

export const fetchProduct = (id: number): Promise<Product> =>
  client.get<Product>(`/products/${id}`).then((r) => r.data)

export const createProduct = (data: Omit<Product, 'id' | 'created_at'>): Promise<Product> =>
  client.post<Product>('/products', data).then((r) => r.data)

export const updateProduct = (id: number, data: Omit<Product, 'id' | 'created_at'>): Promise<Product> =>
  client.put<Product>(`/products/${id}`, data).then((r) => r.data)

export const deleteProduct = (id: number): Promise<void> =>
  client.delete(`/products/${id}`).then(() => undefined)

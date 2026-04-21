export type ProductCategory = 'TCG' | 'BOARD_GAME' | 'ACCESSORY'

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  category: ProductCategory
  stock: number
  image_url: string | null
  created_at: string
}

export type TournamentStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED'

export interface Tournament {
  id: number
  name: string
  game: string
  date: string
  max_players: number
  registered_players: number
  entry_fee: number
  status: TournamentStatus
  created_at: string
}

export type UserRole = 'USER' | 'VENDOR' | 'ADMIN'

export interface User {
  id: number
  email: string
  username: string
  role: UserRole
  is_verified: boolean
  created_at: string
}

export type GradingCompany = 'PSA' | 'BGS' | 'CGC'

export interface GradedCard {
  id: number
  card_name: string
  card_number: string
  set_name: string
  pokemon_tcg_id: string | null
  image_url: string | null
  grading_company: GradingCompany
  grade: string
  cert_number: string | null
  price: number
  stock: number
  description: string | null
  created_at: string
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED'

export interface OrderItem {
  id: number
  product_id: number | null
  graded_card_id: number | null
  quantity: number
  unit_price: number
}

export interface Order {
  id: number
  status: OrderStatus
  total: number
  created_at: string
  items: OrderItem[]
}

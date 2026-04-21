export const CATEGORY_LABELS: Record<string, string> = {
  TCG: 'Jeu de cartes',
  BOARD_GAME: 'Jeu de société',
  ACCESSORY: 'Accessoire',
}

export const TOURNAMENT_STATUS_LABELS: Record<string, string> = {
  UPCOMING: 'Inscriptions ouvertes',
  ONGOING: 'En cours',
  COMPLETED: 'Terminé',
}

export const TOURNAMENT_STATUS_STYLE: Record<string, string> = {
  UPCOMING: 'bg-green-500/20 text-green-400',
  ONGOING: 'bg-yellow/20 text-yellow-dark',
  COMPLETED: 'bg-white/10 text-white/40',
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  PAID: 'Payée',
  CANCELLED: 'Annulée',
}

export const ORDER_STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-yellow/20 text-yellow-dark',
  PAID: 'bg-green-500/20 text-green-600',
  CANCELLED: 'bg-red-500/20 text-red-500',
}

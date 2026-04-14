import { useState } from 'react'
import { useTournamentStore } from '../store/tournamentStore'
import type { Tournament } from '../types'

const STATUS_LABELS: Record<string, string> = {
  UPCOMING: 'À venir',
  ONGOING: 'En cours',
  COMPLETED: 'Terminé',
}

const STATUS_COLORS: Record<string, string> = {
  UPCOMING: 'bg-green-100 text-green-700',
  ONGOING: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-gray-100 text-gray-500',
}

interface Props {
  tournament: Tournament
}

export default function TournamentCard({ tournament }: Props) {
  const register = useTournamentStore((s) => s.register)
  const [playerId, setPlayerId] = useState('')
  const [msg, setMsg] = useState('')
  const isFull = tournament.registered_players >= tournament.max_players

  const handleRegister = async () => {
    if (!playerId.trim()) {
      setMsg('Veuillez entrer votre identifiant.')
      return
    }
    try {
      await register(tournament.id, playerId.trim())
      setMsg('Inscription réussie !')
    } catch {
      setMsg('Erreur lors de l\'inscription.')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800 text-lg leading-tight">{tournament.name}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[tournament.status]}`}
        >
          {STATUS_LABELS[tournament.status]}
        </span>
      </div>
      <p className="text-sm text-gray-500">{tournament.game}</p>
      <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
        <span>Date :</span>
        <span>{new Date(tournament.date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</span>
        <span>Joueurs :</span>
        <span>
          {tournament.registered_players} / {tournament.max_players}
        </span>
        <span>Entrée :</span>
        <span>{tournament.entry_fee.toFixed(2)} €</span>
      </div>

      {tournament.status === 'UPCOMING' && !isFull && (
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            placeholder="Votre identifiant joueur"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            S'inscrire
          </button>
        </div>
      )}
      {isFull && tournament.status === 'UPCOMING' && (
        <p className="text-sm text-red-500 font-medium">Complet</p>
      )}
      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </div>
  )
}

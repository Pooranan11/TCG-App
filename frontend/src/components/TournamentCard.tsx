import { useState } from 'react'
import { useTournamentStore } from '../store/tournamentStore'
import type { Tournament } from '../types'

const STATUS_LABELS: Record<string, string> = {
  UPCOMING: 'À venir',
  ONGOING: 'En cours',
  COMPLETED: 'Terminé',
}

const STATUS_COLORS: Record<string, string> = {
  UPCOMING: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-blue-500 text-white',
  COMPLETED: 'bg-blue-200 text-blue-400',
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
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 border border-blue-100 hover:shadow-blue-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-blue-900 text-lg leading-tight">{tournament.name}</h3>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[tournament.status]}`}
        >
          {STATUS_LABELS[tournament.status]}
        </span>
      </div>
      <p className="text-sm text-blue-500 font-medium">{tournament.game}</p>
      <div className="text-sm text-blue-700 grid grid-cols-2 gap-1">
        <span className="text-blue-400">Date :</span>
        <span>{new Date(tournament.date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</span>
        <span className="text-blue-400">Joueurs :</span>
        <span>
          {tournament.registered_players} / {tournament.max_players}
        </span>
        <span className="text-blue-400">Entrée :</span>
        <span>{tournament.entry_fee.toFixed(2)} €</span>
      </div>

      {tournament.status === 'UPCOMING' && !isFull && (
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            placeholder="Votre identifiant joueur"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="flex-1 border border-blue-200 rounded-lg px-3 py-1.5 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            S'inscrire
          </button>
        </div>
      )}
      {isFull && tournament.status === 'UPCOMING' && (
        <p className="text-sm text-blue-400 font-medium">Complet</p>
      )}
      {msg && <p className="text-sm text-blue-600">{msg}</p>}
    </div>
  )
}

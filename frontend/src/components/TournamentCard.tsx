import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTournamentStore } from '../store/tournamentStore'
import type { Tournament } from '../types'

const STATUS_LABELS: Record<string, string> = {
  UPCOMING: 'Inscriptions ouvertes',
  ONGOING: 'En cours',
  COMPLETED: 'Termine',
}

const STATUS_STYLE: Record<string, string> = {
  UPCOMING: 'bg-green-500/20 text-green-400',
  ONGOING: 'bg-yellow/20 text-yellow-dark',
  COMPLETED: 'bg-white/10 text-white/40',
}

interface Props {
  tournament: Tournament
}

export default function TournamentCard({ tournament }: Props) {
  const register = useTournamentStore((s) => s.register)
  const user = useAuthStore((s) => s.user)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const isFull = tournament.registered_players >= tournament.max_players
  const spotsLeft = tournament.max_players - tournament.registered_players
  const fillPct = Math.round((tournament.registered_players / tournament.max_players) * 100)

  const handleRegister = async () => {
    setLoading(true)
    setMsg('')
    try {
      await register(tournament.id)
      setMsg('Inscription confirmee !')
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setMsg(detail ?? "Erreur lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-navy/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10">
      {/* Header navy */}
      <div className="bg-navy px-5 py-3 flex items-center justify-between">
        <span className="font-condensed font-black text-[0.8rem] tracking-[0.12em] uppercase text-yellow">
          {tournament.game}
        </span>
        <span className={`font-condensed font-bold text-[0.6rem] tracking-[0.15em] uppercase px-2 py-0.5 ${STATUS_STYLE[tournament.status]}`}>
          {STATUS_LABELS[tournament.status]}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-condensed font-black text-[1.1rem] uppercase text-navy leading-tight mb-4">
          {tournament.name}
        </h3>
        <div className="flex flex-col gap-1.5 mb-4 text-[0.78rem] text-muted">
          <div className="flex items-center gap-2">
            <span>Date :</span>
            <span className="text-navy font-medium">
              {new Date(tournament.date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Joueurs :</span>
            <span className="text-navy font-medium">
              {tournament.registered_players} / {tournament.max_players}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-1">
          <div className="h-1 bg-navy/10 rounded-full overflow-hidden">
            <div className="h-full bg-yellow rounded-full transition-all" style={{ width: `${fillPct}%` }} />
          </div>
          {!isFull && (
            <p className="text-[0.65rem] text-muted mt-1">{spotsLeft} place{spotsLeft > 1 ? 's' : ''} restante{spotsLeft > 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-navy/10 flex items-center justify-between gap-3">
        <div>
          <span className="font-condensed font-black text-xl text-navy">
            {tournament.entry_fee.toFixed(2)} <span className="text-sm font-semibold text-muted">€</span>
          </span>
        </div>

        {tournament.status === 'UPCOMING' && !isFull ? (
          <div className="flex gap-2 flex-1 justify-end">
            {user ? (
              <button
                onClick={handleRegister}
                disabled={loading}
                className="font-condensed font-black text-[0.72rem] tracking-[0.1em] uppercase bg-yellow text-navy px-4 py-1.5 hover:bg-yellow-light transition-colors disabled:opacity-60"
              >
                {loading ? '...' : "S'inscrire"}
              </button>
            ) : (
              <Link
                to="/login"
                className="font-condensed font-black text-[0.72rem] tracking-[0.1em] uppercase bg-yellow text-navy px-4 py-1.5 hover:bg-yellow-light transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>
        ) : isFull ? (
          <span className="font-condensed font-bold text-[0.72rem] tracking-[0.1em] uppercase bg-light text-muted px-4 py-1.5">
            Complet
          </span>
        ) : null}
      </div>

      {msg && (
        <p className="px-5 pb-3 text-[0.75rem] text-navy font-medium">{msg}</p>
      )}
    </div>
  )
}

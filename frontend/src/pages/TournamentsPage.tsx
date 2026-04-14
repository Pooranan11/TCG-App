import { useEffect } from 'react'
import TournamentCard from '../components/TournamentCard'
import { useTournamentStore } from '../store/tournamentStore'

export default function TournamentsPage() {
  const { tournaments, loading, error, load } = useTournamentStore()

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Tournois</h1>

      {loading && <p className="text-blue-400">Chargement…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <TournamentCard key={t.id} tournament={t} />
        ))}
      </div>

      {!loading && tournaments.length === 0 && (
        <p className="text-blue-300 text-center py-12">Aucun tournoi programmé pour le moment.</p>
      )}
    </div>
  )
}

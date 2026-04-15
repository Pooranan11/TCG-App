import { useEffect } from 'react'
import TournamentCard from '../components/TournamentCard'
import SectionHeader from '../components/SectionHeader'
import { useTournamentStore } from '../store/tournamentStore'

export default function TournamentsPage() {
  const { tournaments, loading, error, load } = useTournamentStore()

  useEffect(() => { load() }, [load])

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <SectionHeader tag="Evenements" title="Tournois" />

      {loading && <p className="text-muted text-sm">Chargement...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {tournaments.map((t) => <TournamentCard key={t.id} tournament={t} />)}
      </div>

      {!loading && tournaments.length === 0 && (
        <p className="text-muted text-center py-16 font-condensed font-bold text-lg uppercase tracking-wide">
          Aucun tournoi programme pour le moment
        </p>
      )}
    </div>
  )
}

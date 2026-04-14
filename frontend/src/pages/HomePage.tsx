import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import TournamentCard from '../components/TournamentCard'
import { useProductStore } from '../store/productStore'
import { useTournamentStore } from '../store/tournamentStore'

export default function HomePage() {
  const { products, loading: pLoading, load: loadProducts } = useProductStore()
  const { tournaments, loading: tLoading, load: loadTournaments } = useTournamentStore()

  useEffect(() => {
    loadProducts()
    loadTournaments()
  }, [loadProducts, loadTournaments])

  const featured = products.slice(0, 4)
  const upcoming = tournaments.filter((t) => t.status === 'UPCOMING').slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-800 to-blue-900 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight uppercase">
          Chasseur <span className="text-yellow-400">de Jeux</span>
        </h1>
        <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
          Votre boutique spécialisée en jeux de cartes à collectionner, jeux de société et tournois locaux.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/products"
            className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow"
          >
            Voir le catalogue
          </Link>
          <Link
            to="/tournaments"
            className="border-2 border-blue-300 text-blue-200 font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors"
          >
            Tournois
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Produits en vedette</h2>
          <Link to="/products" className="text-blue-600 text-sm font-medium hover:underline">
            Voir tout →
          </Link>
        </div>
        {pLoading ? (
          <p className="text-blue-400">Chargement…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming tournaments */}
      <section className="bg-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Prochains tournois</h2>
            <Link to="/tournaments" className="text-blue-600 text-sm font-medium hover:underline">
              Voir tout →
            </Link>
          </div>
          {tLoading ? (
            <p className="text-blue-400">Chargement…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcoming.map((t) => (
                <TournamentCard key={t.id} tournament={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

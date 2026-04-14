import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import TournamentCard from '../components/TournamentCard'
import SectionHeader from '../components/SectionHeader'
import { useProductStore } from '../store/productStore'
import { useTournamentStore } from '../store/tournamentStore'

const CATEGORIES = [
  {
    key: 'TCG',
    name: 'Jeux de cartes',
    desc: 'Pokemon, Magic, Yu-Gi-Oh!, One Piece et bien plus. Boosters, decks et displays.',
    count: 'TCG',
  },
  {
    key: 'BOARD_GAME',
    name: 'Jeux de societe',
    desc: 'Strategiques, familiaux ou cooperatifs — trouvez votre prochaine aventure.',
    count: 'BOARD GAME',
  },
  {
    key: 'ACCESSORY',
    name: 'Accessoires',
    desc: 'Protege-cartes, classeurs, boites de rangement pour proteger votre collection.',
    count: 'ACCESSORY',
  },
]

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
      {/* ── HERO ── */}
      <section className="bg-navy relative overflow-hidden min-h-[480px] flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle 500px at 80% 50%, rgba(245,200,0,0.07) 0%, transparent 70%), repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)'
            }}
          />
          <div className="absolute rounded-full border-[40px] border-yellow/[0.08]"
            style={{ width: 420, height: 420, right: -80, top: '50%', transform: 'translateY(-50%)' }} />
          <div className="absolute rounded-full border-[2px] border-yellow/[0.12]"
            style={{ width: 560, height: 560, right: -120, top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 w-full grid md:grid-cols-[1fr_400px] gap-12 items-center relative z-10">
          {/* Text */}
          <div>
            <div className="inline-flex items-center bg-yellow text-navy font-condensed font-black text-[0.7rem] tracking-[0.15em] uppercase px-3 py-1.5 mb-5">
              Boutique TCG et Jeux de societe
            </div>
            <h1 className="font-condensed font-black uppercase leading-[0.95] text-white mb-5"
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '0.02em' }}>
              Chasseur<br />
              <span className="text-yellow">de Jeux</span>
            </h1>
            <p className="text-white/60 font-light leading-relaxed mb-8 max-w-md">
              Votre boutique specialisee en jeux de cartes a collectionner, jeux de societe et tournois locaux.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/products"
                className="font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy px-8 py-3.5 hover:bg-yellow-light transition-all hover:-translate-y-0.5"
              >
                Voir le catalogue
              </Link>
              <Link
                to="/tournaments"
                className="font-condensed font-bold text-[0.85rem] tracking-[0.12em] uppercase border-2 border-white/25 text-white px-8 py-3.5 hover:border-yellow hover:text-yellow transition-colors"
              >
                Tournois
              </Link>
            </div>
          </div>

          {/* Card stack visual */}
          <div className="hidden md:flex items-center justify-center h-[300px]">
            <div className="relative w-[180px] h-[250px] group">
              {[
                { style: { transform: 'rotate(-10deg) translate(-32px, 10px)', zIndex: 1 }, border: 'border-yellow/30' },
                { style: { transform: 'rotate(0deg)', zIndex: 3 }, border: 'border-yellow', glow: true },
                { style: { transform: 'rotate(9deg) translate(32px, 10px)', zIndex: 2 }, border: 'border-yellow/30' },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`absolute w-[165px] h-[230px] rounded-xl flex flex-col items-center justify-center gap-2 border-2 ${card.border} transition-transform duration-300`}
                  style={{
                    ...card.style,
                    background: i === 1
                      ? 'linear-gradient(145deg, #0d1a3e, #1a2b5e)'
                      : 'linear-gradient(145deg, #1a2b5e, #243577)',
                    boxShadow: card.glow
                      ? '0 0 0 1px rgba(245,200,0,0.2), 0 16px 48px rgba(0,0,0,0.5)'
                      : '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <rect x="4" y="6" width="28" height="32" rx="4" fill="rgba(245,200,0,0.15)" />
                    <rect x="8" y="10" width="20" height="14" rx="2" fill="rgba(245,200,0,0.2)" />
                    <rect x="8" y="28" width="12" height="3" rx="1" fill="rgba(245,200,0,0.3)" />
                    <rect x="8" y="33" width="8" height="2" rx="1" fill="rgba(245,200,0,0.2)" />
                  </svg>
                  <div className="w-9 h-0.5 bg-yellow opacity-50" />
                  <span className="font-condensed font-bold text-[0.5rem] tracking-[0.2em] uppercase text-white/40">
                    {i === 0 ? 'Jeux de cartes' : i === 1 ? 'Chasseur de Jeux' : 'Collection'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-6 left-6 flex gap-10">
          {[
            { n: '500+', l: 'Produits' },
            { n: '12+', l: 'Tournois / an' },
            { n: '1000+', l: 'Joueurs' },
          ].map(({ n, l }) => (
            <div key={l}>
              <span className="font-condensed font-black text-[1.8rem] text-yellow block leading-none">{n}</span>
              <span className="text-[0.65rem] tracking-[0.15em] uppercase text-white/45">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMO BAND ── */}
      <div className="bg-yellow flex items-center justify-center gap-12 px-6 py-3 overflow-hidden">
        {[
          'Retrait en boutique disponible',
          'Nouveautes chaque semaine',
          'Tournois reguliers',
          'Conseils de nos experts',
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 whitespace-nowrap">
            {i > 0 && <span className="w-1.5 h-1.5 rounded-full bg-navy/30" />}
            <span className="font-condensed font-black text-[0.78rem] tracking-[0.12em] uppercase text-navy">
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* ── PRODUITS EN VEDETTE ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <SectionHeader tag="Selection" title="Produits en vedette" linkTo="/products" linkLabel="Voir tout" />
        {pLoading ? (
          <p className="text-muted text-sm">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader tag="Univers" title="Nos categories" linkTo="/products" linkLabel="Voir tout" light />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                to={`/products`}
                className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.05] p-8 cursor-pointer transition-all duration-300 hover:bg-yellow/[0.08] hover:border-yellow/35 hover:-translate-y-0.5 group"
              >
                <span className="absolute top-4 right-4 text-yellow opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] translate-y-[4px] group-hover:translate-x-0 group-hover:translate-y-0 text-xl font-bold">
                  →
                </span>
                <div className="font-condensed font-black text-[1.15rem] uppercase text-white mb-2">
                  {cat.name}
                </div>
                <p className="text-[0.82rem] text-white/50 leading-relaxed mb-4">{cat.desc}</p>
                <span className="inline-block font-condensed font-bold text-[0.65rem] tracking-[0.15em] uppercase bg-yellow/15 text-yellow px-3 py-1 rounded-sm">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOURNOIS ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <SectionHeader tag="Evenements" title="Prochains tournois" linkTo="/tournaments" linkLabel="Voir tout" />
        {tLoading ? (
          <p className="text-muted text-sm">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcoming.map((t) => <TournamentCard key={t.id} tournament={t} />)}
          </div>
        )}
      </section>
    </div>
  )
}

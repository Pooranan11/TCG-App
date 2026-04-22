import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import TournamentCard from '../components/TournamentCard'
import SectionHeader from '../components/SectionHeader'
import { useProductStore } from '../store/productStore'
import { useTournamentStore } from '../store/tournamentStore'
import { useGradedCardStore } from '../store/gradedCardStore'

const CATEGORIES = [
  {
    key: 'TCG',
    name: 'Jeux de cartes',
    desc: 'Pokemon, Magic, Yu-Gi-Oh!, One Piece et bien plus. Boosters, decks et displays.',
    pill: 'TCG',
  },
  {
    key: 'BOARD_GAME',
    name: 'Jeux de societe',
    desc: 'Strategiques, familiaux ou cooperatifs — trouvez votre prochaine aventure.',
    pill: 'Board Game',
  },
  {
    key: 'ACCESSORY',
    name: 'Accessoires',
    desc: 'Protege-cartes, classeurs, boites de rangement pour proteger votre collection.',
    pill: 'Accessory',
  },
]

const STATS = [
  { n: '500+', l: 'Produits' },
  { n: '12+', l: 'Tournois / an' },
  { n: '1000+', l: 'Joueurs' },
]

export default function HomePage() {
  const { products, loading: pLoading, load: loadProducts } = useProductStore()
  const { tournaments, loading: tLoading, load: loadTournaments } = useTournamentStore()
  const { cards: gradedCards, load: loadGradedCards } = useGradedCardStore()

  useEffect(() => {
    loadProducts()
    loadTournaments()
    loadGradedCards()
  }, [loadProducts, loadTournaments, loadGradedCards])

  const featured = products.slice(0, 4)
  const upcoming = tournaments.filter((t) => t.status === 'UPCOMING').slice(0, 3)

  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-navy relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle 600px at 75% 50%, rgba(245,200,0,0.07) 0%, transparent 70%), repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)'
          }} />
          <div className="absolute rounded-full border-[40px] border-yellow/[0.06] hidden lg:block"
            style={{ width: 480, height: 480, right: -80, top: '50%', transform: 'translateY(-50%)' }} />
          <div className="absolute rounded-full border-[2px] border-yellow/[0.1] hidden lg:block"
            style={{ width: 640, height: 640, right: -140, top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-24
                        grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center bg-yellow text-navy font-condensed font-black text-[0.7rem] tracking-[0.15em] uppercase px-3 py-1.5 mb-4 sm:mb-5">
              Boutique TCG et Jeux de societe
            </div>
            <h1 className="font-condensed font-black uppercase text-white leading-[0.92] mb-4 sm:mb-5"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', letterSpacing: '0.02em' }}>
              Chasseur<br />
              <span className="text-yellow">de Jeux</span>
            </h1>
            <p className="text-white/60 font-light leading-relaxed mb-6 sm:mb-8 max-w-lg"
              style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}>
              Votre boutique specialisee en jeux de cartes a collectionner, jeux de societe et tournois locaux.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/products"
                className="font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy px-6 sm:px-8 py-3 sm:py-3.5 hover:bg-yellow-light transition-all hover:-translate-y-0.5 active:translate-y-0">
                Voir le catalogue
              </Link>
              <Link to="/tournaments"
                className="font-condensed font-bold text-[0.85rem] tracking-[0.12em] uppercase border-2 border-white/25 text-white px-6 sm:px-8 py-3 sm:py-3.5 hover:border-yellow hover:text-yellow transition-colors">
                Tournois
              </Link>
            </div>
          </div>

          {/* 3D rotating carousel — hidden on small screens */}
          <div className="hidden lg:block relative overflow-hidden" style={{ width: '420px', height: '340px' }}>
            <style>{`
              @keyframes rotating {
                from { transform: perspective(1000px) rotateX(-20deg) rotateY(0turn); }
                to   { transform: perspective(1000px) rotateX(-20deg) rotateY(1turn); }
              }
            `}</style>
            <div
              style={{
                position: 'absolute',
                width: '120px',
                height: '168px',
                top: '22%',
                left: 'calc(50% - 60px)',
                transformStyle: 'preserve-3d',
                animation: 'rotating 18s linear infinite',
              }}
            >
              {(gradedCards.length > 0 ? gradedCards.slice(0, 6) : Array(6).fill(null)).map((card, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid rgba(245,200,0,0.45)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    transform: `rotateY(${(360 / 6) * i}deg) translateZ(240px)`,
                  }}
                >
                  {card?.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.card_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'radial-gradient(circle, rgba(245,200,0,0.08) 0%, rgba(26,43,94,0.9) 100%)',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats — full width */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-8 sm:pb-10 flex gap-8 sm:gap-12">
          {STATS.map(({ n, l }) => (
            <div key={l}>
              <span className="font-condensed font-black text-yellow block leading-none"
                style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}>{n}</span>
              <span className="text-[0.62rem] sm:text-[0.65rem] tracking-[0.15em] uppercase text-white/45">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMO BAND ── */}
      <div className="bg-yellow overflow-x-auto">
        <div className="flex items-center gap-8 sm:gap-12 px-4 sm:px-6 py-3 min-w-max sm:min-w-0 sm:justify-center">
          {['Retrait en boutique disponible', 'Nouveautes chaque semaine', 'Tournois reguliers', 'Conseils de nos experts'].map((item, i) => (
            <div key={i} className="flex items-center gap-3 whitespace-nowrap">
              {i > 0 && <span className="w-1 h-1 rounded-full bg-navy/30" />}
              <span className="font-condensed font-black text-[0.75rem] sm:text-[0.78rem] tracking-[0.12em] uppercase text-navy">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUITS EN VEDETTE ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
        <SectionHeader tag="Selection" title="Produits en vedette" linkTo="/products" linkLabel="Voir tout" />
        {pLoading ? (
          <p className="text-muted text-sm">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-navy py-10 sm:py-14 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <SectionHeader tag="Univers" title="Nos categories" linkTo="/products" linkLabel="Voir tout" light />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
            {CATEGORIES.map((cat) => (
              <Link key={cat.key} to="/products"
                className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.05] p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:bg-yellow/[0.08] hover:border-yellow/35 hover:-translate-y-0.5 group">
                <span className="absolute top-4 right-4 text-yellow text-xl font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] translate-y-[4px] group-hover:translate-x-0 group-hover:translate-y-0">
                  →
                </span>
                <div className="font-condensed font-black uppercase text-white mb-2"
                  style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}>{cat.name}</div>
                <p className="text-[0.82rem] text-white/50 leading-relaxed mb-4">{cat.desc}</p>
                <span className="inline-block font-condensed font-bold text-[0.65rem] tracking-[0.15em] uppercase bg-yellow/15 text-yellow px-3 py-1 rounded-sm">
                  {cat.pill}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOURNOIS ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
        <SectionHeader tag="Evenements" title="Prochains tournois" linkTo="/tournaments" linkLabel="Voir tout" />
        {tLoading ? (
          <p className="text-muted text-sm">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {upcoming.map((t) => <TournamentCard key={t.id} tournament={t} />)}
          </div>
        )}
      </section>
    </div>
  )
}

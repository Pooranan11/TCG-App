import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import TournamentCard from '../components/TournamentCard'
import SectionHeader from '../components/SectionHeader'
import { useProductStore } from '../store/productStore'
import { useTournamentStore } from '../store/tournamentStore'
import { useGradedCardStore } from '../store/gradedCardStore'
import GradedCardCarousel from '../components/GradedCardCarousel'

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
          {/* Espace — nébuleuses + champ d'étoiles */}
          <div className="absolute inset-0" style={{
            background: [
              // nébuleuse rouge/orange haut-droite
              'radial-gradient(ellipse 55% 45% at 80% 20%, rgba(220,80,60,0.1) 0%, transparent 70%)',
              // nébuleuse bleue bas-gauche
              'radial-gradient(ellipse 65% 50% at 10% 80%, rgba(40,80,220,0.22) 0%, transparent 70%)',
              // nébuleuse verte sous "Chasseur de Jeux"
              'radial-gradient(ellipse 45% 55% at 28% 60%, rgba(40,200,100,0.1) 0%, transparent 65%)',
              // halo jaune carousel
              'radial-gradient(circle 600px at 75% 50%, rgba(245,200,0,0.07) 0%, transparent 70%)',
              // étoiles brillantes (grosses)
              'radial-gradient(2px 2px at  8% 12%, rgba(255,255,255,0.9) 0%, transparent 100%)',
              'radial-gradient(2px 2px at 43% 8%,  rgba(255,255,255,0.85) 0%, transparent 100%)',
              'radial-gradient(2px 2px at 91% 22%, rgba(255,255,255,0.9) 0%, transparent 100%)',
              'radial-gradient(2px 2px at 63% 78%, rgba(255,255,255,0.8) 0%, transparent 100%)',
              'radial-gradient(2px 2px at 18% 91%, rgba(255,255,255,0.85) 0%, transparent 100%)',
              'radial-gradient(2.5px 2.5px at 77% 6%, rgba(255,255,240,0.95) 0%, transparent 100%)',
              // étoiles moyennes
              'radial-gradient(1.5px 1.5px at 22% 35%, rgba(255,255,255,0.7) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 37% 58%, rgba(255,255,255,0.65) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 55% 22%, rgba(255,255,255,0.75) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 70% 44%, rgba(255,255,255,0.6) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 85% 68%, rgba(255,255,255,0.7) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 14% 55%, rgba(255,255,255,0.65) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 48% 88%, rgba(255,255,255,0.6) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 95% 50%, rgba(255,255,255,0.7) 0%, transparent 100%)',
              // petites étoiles (nombreuses)
              'radial-gradient(1px 1px at  5% 42%, rgba(255,255,255,0.5) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 16% 76%, rgba(255,255,255,0.45) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 29% 19%, rgba(255,255,255,0.55) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 33% 83%, rgba(255,255,255,0.4) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 50% 47%, rgba(255,255,255,0.5) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 58% 95%, rgba(255,255,255,0.45) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 72% 28%, rgba(255,255,255,0.55) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 81% 85%, rgba(255,255,255,0.4) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 88% 14%, rgba(255,255,255,0.5) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 97% 72%, rgba(255,255,255,0.45) 0%, transparent 100%)',
              // étoiles teintées (bleues/jaunes)
              'radial-gradient(1.5px 1.5px at 25% 65%, rgba(180,210,255,0.8) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 60% 38%, rgba(255,240,180,0.8) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 40% 72%, rgba(180,210,255,0.75) 0%, transparent 100%)',
            ].join(', ')
          }} />
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
            <p className="text-white/60 font-condensed font-normal leading-relaxed mb-6 sm:mb-8 max-w-lg"
              style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}>
              Boosters, decks, tournois, bref tout ce qu'il te faut pour jouer, collectionner et dominer
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

          <GradedCardCarousel cards={gradedCards} />
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

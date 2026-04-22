import type { GradedCard } from '../types'

const POKEMON_CARD_BACK = 'https://images.pokemontcg.io/back.png'
const DURATION = 20 // seconds
const N = 6

interface Props {
  cards: GradedCard[]
}

export default function GradedCardCarousel({ cards }: Props) {
  const items = cards.length > 0 ? cards.slice(0, N) : Array(N).fill(null)

  return (
    <div className="hidden lg:flex items-center justify-center" style={{ width: '420px', height: '340px' }}>
      {/* inclinaison statique du plan */}
      <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateZ(-8deg)' }}>
      <div
        className="carousel-3d"
        style={{
          position: 'relative',
          width: '110px',
          height: '154px',
          transformStyle: 'preserve-3d',
          animation: `carousel-spin ${DURATION}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {items.map((card: GradedCard | null, i: number) => (
          <div
            key={i}
            className="carousel-card"
            style={{
              position: 'absolute',
              width: '110px',
              height: '154px',
              top: '50%',
              left: '50%',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '2px solid rgba(245,200,0,0.5)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.65)',
              transform: `translate(-50%, -50%) rotateY(${(360 / N) * i}deg) translateZ(200px)`,
              animation: `card-brightness ${DURATION}s linear infinite`,
              animationDelay: `${-(DURATION / N) * i}s`,
              willChange: 'transform, filter',
            }}
          >
            <img
              src={card?.image_url ?? POKEMON_CARD_BACK}
              alt={card?.card_name ?? 'Dos carte Pokémon'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

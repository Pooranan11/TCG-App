import type { GradedCard } from '../types'

const POKEMON_CARD_BACK = 'https://images.pokemontcg.io/back.png'

interface Props {
  cards: GradedCard[]
}

export default function GradedCardCarousel({ cards }: Props) {
  const items = cards.length > 0 ? cards.slice(0, 6) : Array(6).fill(null)

  return (
    <div className="hidden lg:block relative" style={{ width: '420px', height: '340px' }}>
      <div
        style={{
          position: 'absolute',
          width: '120px',
          height: '168px',
          top: '22%',
          left: 'calc(50% - 60px)',
          transformStyle: 'preserve-3d',
          animation: 'carousel-rotate 20s linear infinite',
        }}
      >
        {items.map((card: GradedCard | null, i: number) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `rotateY(${(360 / 6) * i}deg) translateZ(190px)`,
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(245,200,0,0.45)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              animation: 'card-breathe 3s ease-in-out infinite',
              animationDelay: `${i * 0.5}s`,
            }}>
              <img
                src={card?.image_url ?? POKEMON_CARD_BACK}
                alt={card?.card_name ?? 'Dos carte Pokémon'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

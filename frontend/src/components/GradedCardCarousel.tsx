import type { GradedCard } from '../types'

const POKEMON_CARD_BACK = 'https://images.pokemontcg.io/back.png'

// x/y = % of container, w/h in px, rot in deg
const LAYOUT = [
  { x: 50, y: 46, w: 152, h: 213, rot: -4,  dur: 3.8, delay: 0,   z: 6, glow: true  },
  { x: 22, y: 34, w: 118, h: 165, rot: -14, dur: 4.3, delay: 0.7, z: 4, glow: false },
  { x: 78, y: 38, w: 118, h: 165, rot:  10, dur: 4.1, delay: 1.1, z: 4, glow: false },
  { x: 11, y: 14, w:  86, h: 120, rot: -21, dur: 5.0, delay: 0.3, z: 2, glow: false },
  { x: 89, y: 10, w:  86, h: 120, rot:  18, dur: 4.7, delay: 1.3, z: 2, glow: false },
  { x: 62, y: 80, w:  98, h: 137, rot: -7,  dur: 4.4, delay: 1.8, z: 3, glow: false },
]

interface Props {
  cards: GradedCard[]
}

export default function GradedCardCarousel({ cards }: Props) {
  const items = cards.length > 0 ? cards.slice(0, 6) : Array(6).fill(null)

  return (
    <div
      className="hidden lg:block"
      style={{ position: 'relative', width: '420px', height: '380px', flexShrink: 0 }}
    >
      {items.map((card: GradedCard | null, i: number) => {
        const l = LAYOUT[i]
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${l.x}%`,
              top: `${l.y}%`,
              transform: 'translate(-50%, -50%)',
              width: l.w,
              height: l.h,
              zIndex: l.z,
            }}
          >
            {/* tilt wrapper — separates rotation from float animation */}
            <div style={{ width: '100%', height: '100%', transform: `rotate(${l.rot}deg)` }}>
              {/* float animation wrapper */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  animation: `card-float ${l.dur}s ease-in-out infinite`,
                  animationDelay: `${l.delay}s`,
                  filter: l.glow
                    ? 'drop-shadow(0 0 22px rgba(245,200,0,0.55)) drop-shadow(0 12px 40px rgba(0,0,0,0.7))'
                    : 'drop-shadow(0 8px 24px rgba(0,0,0,0.65))',
                }}
              >
                <img
                  src={card?.image_url ?? POKEMON_CARD_BACK}
                  alt={card?.card_name ?? 'Dos carte Pokémon'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: l.glow
                      ? '2px solid rgba(245,200,0,0.75)'
                      : '2px solid rgba(245,200,0,0.3)',
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

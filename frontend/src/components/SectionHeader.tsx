import { Link } from 'react-router-dom'

interface Props {
  tag: string
  title: string
  linkTo?: string
  linkLabel?: string
  light?: boolean
}

export default function SectionHeader({ tag, title, linkTo, linkLabel, light }: Props) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className={`flex items-center gap-2 mb-1 font-condensed font-black text-[0.7rem] tracking-[0.2em] uppercase ${light ? 'text-yellow/70' : 'text-yellow-dark'}`}>
          <span className="w-[18px] h-[3px] bg-yellow rounded-sm block" />
          {tag}
        </div>
        <h2 className={`font-condensed font-black text-[clamp(1.6rem,2.5vw,2.2rem)] uppercase tracking-wide leading-none ${light ? 'text-white' : 'text-navy'}`}>
          {title}
        </h2>
      </div>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className={`font-condensed font-bold text-[0.78rem] tracking-[0.12em] uppercase border-b-2 border-yellow pb-0.5 transition-colors ${light ? 'text-white hover:text-yellow' : 'text-navy hover:text-yellow-dark'}`}
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

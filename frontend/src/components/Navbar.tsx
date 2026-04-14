import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-condensed font-bold text-sm tracking-widest uppercase h-16 flex items-center px-5 border-b-[3px] transition-colors duration-200 ${
      isActive
        ? 'text-yellow border-yellow'
        : 'text-white/65 border-transparent hover:text-white hover:border-yellow'
    }`

  return (
    <nav className="bg-navy sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={40} />
          <div className="flex flex-col leading-none">
            <span className="font-condensed font-black text-xl uppercase tracking-wide text-white">
              Chasseur
            </span>
            <span className="font-condensed font-semibold text-[0.65rem] uppercase tracking-[0.12em] text-yellow">
              de Jeux
            </span>
          </div>
        </Link>

        <ul className="flex">
          <li>
            <NavLink to="/" end className={linkClass}>Accueil</NavLink>
          </li>
          <li>
            <NavLink to="/products" className={linkClass}>Catalogue</NavLink>
          </li>
          <li>
            <NavLink to="/tournaments" className={linkClass}>Tournois</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

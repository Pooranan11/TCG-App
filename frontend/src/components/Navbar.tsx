import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-yellow-400 font-semibold'
      : 'text-blue-100 hover:text-white transition-colors'

  return (
    <nav className="bg-blue-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={44} />
          <div className="flex flex-col leading-none">
            <span className="text-white font-black text-xl uppercase tracking-wide">Chasseur</span>
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-widest">de Jeux</span>
          </div>
        </Link>
        <div className="flex gap-6">
          <NavLink to="/" end className={linkClass}>
            Accueil
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Catalogue
          </NavLink>
          <NavLink to="/tournaments" className={linkClass}>
            Tournois
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

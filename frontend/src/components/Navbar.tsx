import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-blue-300 font-semibold'
      : 'text-blue-100 hover:text-white transition-colors'

  return (
    <nav className="bg-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white tracking-wide">
          TCG<span className="text-blue-300">_App</span>
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

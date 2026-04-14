import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-yellow-400 font-semibold'
      : 'text-gray-300 hover:text-white transition-colors'

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-yellow-400">
          TCG_App
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

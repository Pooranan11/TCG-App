import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuthStore } from '../store/authStore'

const LINKS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/products', label: 'Catalogue', end: false },
  { to: '/tournaments', label: 'Tournois', end: false },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    `font-condensed font-bold text-sm tracking-widest uppercase h-16 flex items-center px-5 border-b-[3px] transition-colors duration-200 ${
      isActive ? 'text-yellow border-yellow' : 'text-white/65 border-transparent hover:text-white hover:border-yellow'
    }`

  return (
    <nav className="bg-navy sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <Logo size={40} />
          <div className="flex flex-col leading-none">
            <span className="font-condensed font-black text-xl uppercase tracking-wide text-white">Chasseur</span>
            <span className="font-condensed font-semibold text-[0.65rem] uppercase tracking-[0.12em] text-yellow">de Jeux</span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex">
          {LINKS.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={desktopLink}>{label}</NavLink>
            </li>
          ))}
        </ul>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase px-3 py-1.5 border rounded transition-colors ${
                      isActive
                        ? 'bg-yellow text-navy border-yellow'
                        : 'text-yellow border-yellow/50 hover:border-yellow hover:bg-yellow/10'
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
              <span className="font-condensed font-bold text-[0.72rem] tracking-[0.12em] uppercase text-white/50">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase px-4 py-1.5 text-white/50 hover:text-white transition-colors"
              >
                S'inscrire
              </Link>
              <Link
                to="/login"
                className="font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase px-4 py-1.5 border border-white/20 text-white/60 hover:border-yellow hover:text-yellow transition-colors rounded"
              >
                Connexion
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-64' : 'max-h-0'}`}>
        <ul className="bg-navy-dark border-t border-white/10 px-4 py-2">
          {LINKS.map(({ to, label, end }) => {
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center font-condensed font-bold text-sm tracking-widest uppercase py-4 border-b border-white/5 transition-colors ${
                    isActive ? 'text-yellow' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {isActive && <span className="w-1 h-4 bg-yellow rounded-sm mr-3" />}
                  {label}
                </Link>
              </li>
            )
          })}
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <li>
                  <Link to="/admin" onClick={() => setOpen(false)}
                    className="flex items-center font-condensed font-bold text-sm tracking-widest uppercase py-4 border-b border-white/5 text-yellow transition-colors">
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout}
                  className="w-full text-left font-condensed font-bold text-sm tracking-widest uppercase py-4 text-white/40 hover:text-white transition-colors">
                  Déconnexion ({user.username})
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register" onClick={() => setOpen(false)}
                  className="flex items-center font-condensed font-bold text-sm tracking-widest uppercase py-4 border-b border-white/5 text-white/65 hover:text-white transition-colors">
                  S'inscrire
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={() => setOpen(false)}
                  className="flex items-center font-condensed font-bold text-sm tracking-widest uppercase py-4 text-white/65 hover:text-white transition-colors">
                  Connexion
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

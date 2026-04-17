import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

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
  const cartCount = useCartStore((s) => s.count)()

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

        {/* Auth area + Cart */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart icon */}
          <Link to="/cart" className="relative flex items-center justify-center w-9 h-9 text-white/60 hover:text-yellow transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow text-navy font-condensed font-black text-[0.6rem] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {(user.role === 'ADMIN' || user.role === 'VENDOR') && (
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
                  {user.role === 'ADMIN' ? 'Admin' : 'Mes produits'}
                </NavLink>
              )}
              <Link
                to="/orders"
                className="font-condensed font-bold text-[0.72rem] tracking-[0.12em] uppercase text-white/50 hover:text-white transition-colors"
              >
                Commandes
              </Link>
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
          <li>
            <Link to="/cart" onClick={() => setOpen(false)}
              className="flex items-center justify-between font-condensed font-bold text-sm tracking-widest uppercase py-4 border-b border-white/5 text-white/65 hover:text-white transition-colors">
              Panier
              {cartCount > 0 && (
                <span className="bg-yellow text-navy font-condensed font-black text-[0.6rem] px-1.5 py-0.5 rounded-full leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          {user ? (
            <>
              {(user.role === 'ADMIN' || user.role === 'VENDOR') && (
                <li>
                  <Link to="/admin" onClick={() => setOpen(false)}
                    className="flex items-center font-condensed font-bold text-sm tracking-widest uppercase py-4 border-b border-white/5 text-yellow transition-colors">
                    {user.role === 'ADMIN' ? 'Admin' : 'Mes produits'}
                  </Link>
                </li>
              )}
              <li>
                <Link to="/orders" onClick={() => setOpen(false)}
                  className="flex items-center font-condensed font-bold text-sm tracking-widest uppercase py-4 border-b border-white/5 text-white/65 hover:text-white transition-colors">
                  Mes commandes
                </Link>
              </li>
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

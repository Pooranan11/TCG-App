import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'

const LINKS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/products', label: 'Catalogue', end: false },
  { to: '/tournaments', label: 'Tournois', end: false },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

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
                  className={`flex items-center font-condensed font-bold text-sm tracking-widest uppercase py-4 border-b border-white/5 last:border-0 transition-colors ${
                    isActive ? 'text-yellow' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {isActive && <span className="w-1 h-4 bg-yellow rounded-sm mr-3" />}
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

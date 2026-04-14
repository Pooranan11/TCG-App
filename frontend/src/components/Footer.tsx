import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-navy-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 py-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <Logo size={36} />
              <div className="flex flex-col leading-none">
                <span className="font-condensed font-black text-lg uppercase tracking-wide text-white">Chasseur</span>
                <span className="font-condensed font-semibold text-[0.6rem] uppercase tracking-[0.12em] text-yellow">de Jeux</span>
              </div>
            </Link>
            <p className="text-[0.82rem] text-white/40 leading-relaxed max-w-[220px]">
              Boutique specialisee en jeux de cartes a collectionner, jeux de societe et tournois locaux.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-condensed font-black text-[0.72rem] tracking-[0.18em] uppercase text-yellow mb-4">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2">
              {[['/', 'Accueil'], ['/products', 'Catalogue'], ['/tournaments', 'Tournois']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-[0.8rem] text-white/45 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-condensed font-black text-[0.72rem] tracking-[0.18em] uppercase text-yellow mb-4">
              Categories
            </h4>
            <ul className="flex flex-col gap-2">
              {['Jeux de cartes TCG', 'Jeux de societe', 'Accessoires'].map((label) => (
                <li key={label}>
                  <Link to="/products" className="text-[0.8rem] text-white/45 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-condensed font-black text-[0.72rem] tracking-[0.18em] uppercase text-yellow mb-4">
              Informations
            </h4>
            <ul className="flex flex-col gap-2">
              {['A propos', 'Contact', 'Mentions legales'].map((label) => (
                <li key={label}>
                  <span className="text-[0.8rem] text-white/45 cursor-not-allowed">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.07] py-5 flex items-center justify-between text-[0.7rem] text-white/30">
          <span>2026 Chasseur de Jeux. Tous droits reserves.</span>
          <span>TCG · Jeux de societe · Tournois</span>
        </div>
      </div>
    </footer>
  )
}

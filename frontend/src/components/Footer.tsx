import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-navy-dark">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-16 py-10 sm:py-12">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <Logo size={40} />
              <div className="flex flex-col leading-none">
                <span className="font-condensed font-black text-xl uppercase tracking-wide text-white">Chasseur</span>
                <span className="font-condensed font-semibold text-[0.65rem] uppercase tracking-[0.12em] text-yellow">de Jeux</span>
              </div>
            </Link>
            <p className="text-[0.82rem] text-white/40 leading-relaxed max-w-[260px]">
              Votre boutique TCG &amp; jeux de societe. Passionnes, pour les passionnes depuis 2018.
            </p>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="font-condensed font-black text-[0.72rem] tracking-[0.18em] uppercase text-yellow mb-4 sm:mb-5">
              Boutique
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[['Cartes TCG', '/products'], ['Jeux de societe', '/products'], ['Accessoires', '/products'], ['Nouveautes', '/products']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-[0.8rem] text-white/45 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tournois */}
          <div>
            <h4 className="font-condensed font-black text-[0.72rem] tracking-[0.18em] uppercase text-yellow mb-4 sm:mb-5">
              Tournois
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[['Agenda', '/tournaments'], ['Resultats', '/tournaments'], ['Classements', '/tournaments'], ["S'inscrire", '/tournaments']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-[0.8rem] text-white/45 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Infos */}
          <div>
            <h4 className="font-condensed font-black text-[0.72rem] tracking-[0.18em] uppercase text-yellow mb-4 sm:mb-5">
              Infos
            </h4>
            <ul className="flex flex-col gap-2.5">
              {['Horaires & acces', 'Contact', 'Instagram', 'CGV'].map((label) => (
                <li key={label}>
                  <span className="text-[0.8rem] text-white/45 cursor-default">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] py-4 sm:py-5 flex flex-col sm:flex-row items-center sm:justify-between gap-2 text-[0.7rem] text-white/30">
          <span>© 2025 Chasseur de Jeux</span>
          <span>Fait avec <span className="text-yellow">★</span> pour les joueurs</span>
        </div>
      </div>
    </footer>
  )
}

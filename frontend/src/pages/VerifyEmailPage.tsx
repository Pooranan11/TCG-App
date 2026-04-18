import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../api/auth'
import Logo from '../components/Logo'

type State = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [state, setState] = useState<State>('loading')

  useEffect(() => {
    if (!token) {
      setState('error')
      return
    }
    verifyEmail(token)
      .then(() => setState('success'))
      .catch(() => setState('error'))
  }, [token])

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute rounded-full border-[40px] border-yellow/[0.06]"
          style={{ width: 500, height: 500, right: -100, bottom: -100 }} />
        <div className="absolute rounded-full border-[2px] border-yellow/[0.08]"
          style={{ width: 300, height: 300, left: -60, top: -60 }} />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size={56} />
          <div className="mt-3 text-center">
            <p className="font-condensed font-black text-2xl uppercase tracking-wide text-white">Chasseur</p>
            <p className="font-condensed font-semibold text-[0.7rem] uppercase tracking-[0.12em] text-yellow">de Jeux</p>
          </div>
        </div>

        <div className="bg-navy-light border border-white/10 rounded-lg p-8 text-center">
          {state === 'loading' && (
            <>
              <div className="w-8 h-8 border-2 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-sm">Vérification en cours…</p>
            </>
          )}

          {state === 'success' && (
            <>
              <div className="text-4xl mb-4">✅</div>
              <h1 className="font-condensed font-black text-xl uppercase tracking-wide text-white mb-3">
                Email vérifié !
              </h1>
              <p className="text-white/60 text-sm mb-6">
                Votre compte est activé. Vous pouvez maintenant vous connecter.
              </p>
              <Link
                to="/login"
                className="inline-block font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy px-8 py-3 hover:bg-yellow-light transition-colors"
              >
                Se connecter
              </Link>
            </>
          )}

          {state === 'error' && (
            <>
              <div className="text-4xl mb-4">❌</div>
              <h1 className="font-condensed font-black text-xl uppercase tracking-wide text-white mb-3">
                Lien invalide
              </h1>
              <p className="text-white/60 text-sm mb-6">
                Ce lien de vérification est invalide ou a expiré (24h).
                <br />Inscrivez-vous à nouveau pour recevoir un nouvel email.
              </p>
              <Link
                to="/register"
                className="inline-block font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy px-8 py-3 hover:bg-yellow-light transition-colors"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-white/30 text-[0.75rem] hover:text-white/60 transition-colors">
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}

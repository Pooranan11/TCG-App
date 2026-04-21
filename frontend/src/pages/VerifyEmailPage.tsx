import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../api/auth'
import AuthLayout from '../components/AuthLayout'

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
  }, [])

  return (
    <AuthLayout>
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
    </AuthLayout>
  )
}

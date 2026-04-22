import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
            <div className="flex justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" className="stroke-green-400" strokeWidth={1.5} />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12l3 3 6-6" />
              </svg>
            </div>
            <h1 className="font-condensed font-black text-2xl uppercase tracking-wide text-white mb-3">
              Vous êtes authentifié !
            </h1>
            <p className="text-white/60 text-sm">
              Votre adresse email est vérifiée.<br />
              Vous pouvez fermer cette page.
            </p>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="text-5xl mb-5">❌</div>
            <h1 className="font-condensed font-black text-2xl uppercase tracking-wide text-white mb-3">
              Lien invalide
            </h1>
            <p className="text-white/60 text-sm">
              Ce lien de vérification est invalide ou a expiré (24h).
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

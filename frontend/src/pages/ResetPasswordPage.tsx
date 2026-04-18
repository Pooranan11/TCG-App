import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/auth'
import Logo from '../components/Logo'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(token, password)
      navigate('/login', { state: { message: 'Mot de passe réinitialisé. Connectez-vous.' } })
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } }
      setError(e.response?.data?.detail ?? 'Lien invalide ou expiré. Veuillez refaire une demande.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white/60 text-sm mb-4">Lien de réinitialisation manquant.</p>
          <Link to="/forgot-password" className="text-yellow hover:text-yellow-light">
            Faire une nouvelle demande
          </Link>
        </div>
      </div>
    )
  }

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

        <div className="bg-navy-light border border-white/10 rounded-lg p-8">
          <h1 className="font-condensed font-black text-xl uppercase tracking-wide text-white mb-2">
            Nouveau mot de passe
          </h1>
          <p className="text-white/50 text-[0.8rem] mb-6">
            Choisissez un nouveau mot de passe pour votre compte.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase text-white/50 mb-1.5">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-navy border border-white/15 text-white placeholder-white/25 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-yellow transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase text-white/50 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full bg-navy border border-white/15 text-white placeholder-white/25 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-yellow transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-[0.8rem] font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy py-3 hover:bg-yellow-light transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer le mot de passe'}
            </button>
          </form>
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

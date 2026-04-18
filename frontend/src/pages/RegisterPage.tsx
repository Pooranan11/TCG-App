import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { register as apiRegister } from '../api/auth'
import Logo from '../components/Logo'

export default function RegisterPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) navigate(user.role === 'USER' ? '/' : '/admin')
  }, [user, navigate])

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
      await apiRegister({ email, username, password })
      setSuccess(true)
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { detail?: string } } }
      if (e.response?.status === 409) {
        setError(e.response.data?.detail ?? 'Email ou nom d\'utilisateur déjà utilisé.')
      } else if (e.response?.status === 503) {
        setError(e.response.data?.detail ?? 'Impossible d\'envoyer l\'email de vérification. Veuillez réessayer.')
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
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
          {success ? (
            <div className="text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h1 className="font-condensed font-black text-xl uppercase tracking-wide text-white mb-3">
                Vérifiez votre email
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Un email de confirmation a été envoyé à <span className="text-yellow">{email}</span>.
                <br /><br />
                Cliquez sur le lien dans l'email pour activer votre compte.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-condensed font-black text-xl uppercase tracking-wide text-white mb-6">
                Créer un compte
              </h1>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase text-white/50 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-navy border border-white/15 text-white placeholder-white/25 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-yellow transition-colors"
                    placeholder="vous@exemple.fr"
                  />
                </div>
                <div>
                  <label className="block font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase text-white/50 mb-1.5">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    className="w-full bg-navy border border-white/15 text-white placeholder-white/25 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-yellow transition-colors"
                    placeholder="dresseur42"
                  />
                </div>
                <div>
                  <label className="block font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase text-white/50 mb-1.5">
                    Mot de passe
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
                  {loading ? 'Création...' : "S'inscrire"}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-4 flex flex-col gap-2">
          <p className="text-white/40 text-[0.78rem]">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-yellow hover:text-yellow-light transition-colors">
              Se connecter
            </Link>
          </p>
          <Link to="/" className="text-white/30 text-[0.75rem] hover:text-white/60 transition-colors">
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}

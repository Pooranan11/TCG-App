import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import AuthLayout from '../components/AuthLayout'

export default function LoginPage() {
  const { login, loading, user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const successMessage = (location.state as { message?: string } | null)?.message ?? ''

  useEffect(() => {
    if (user) navigate(user.role === 'USER' ? '/' : '/admin')
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
    } catch {
      setError('Email ou mot de passe incorrect.')
    }
  }

  return (
    <AuthLayout>
      <div className="bg-navy-light border border-white/10 rounded-lg p-8">
        <h1 className="font-condensed font-black text-xl uppercase tracking-wide text-white mb-6">
          Connexion
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
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block font-condensed font-bold text-[0.72rem] tracking-[0.15em] uppercase text-white/50 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-navy border border-white/15 text-white placeholder-white/25 px-4 py-2.5 pr-11 text-sm rounded focus:outline-none focus:border-yellow transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {successMessage && (
            <p className="text-green-400 text-[0.8rem] font-medium">{successMessage}</p>
          )}
          {error && (
            <p className="text-red-400 text-[0.8rem] font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy py-3 hover:bg-yellow-light transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>

      <div className="text-center mt-4 flex flex-col gap-2">
        <p className="text-white/40 text-[0.78rem]">
          <Link to="/forgot-password" className="text-yellow hover:text-yellow-light transition-colors">
            Mot de passe oublié ?
          </Link>
        </p>
        <p className="text-white/40 text-[0.78rem]">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-yellow hover:text-yellow-light transition-colors">
            S'inscrire
          </Link>
        </p>
        <Link to="/" className="text-white/30 text-[0.75rem] hover:text-white/60 transition-colors">
          Retour au site
        </Link>
      </div>
    </AuthLayout>
  )
}

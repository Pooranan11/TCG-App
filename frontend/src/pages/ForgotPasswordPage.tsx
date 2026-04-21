import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth'
import AuthLayout from '../components/AuthLayout'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSubmitted(true)
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="bg-navy-light border border-white/10 rounded-lg p-8">
        {submitted ? (
          <div className="text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h1 className="font-condensed font-black text-xl uppercase tracking-wide text-white mb-3">
              Email envoyé
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Si l'adresse <span className="text-yellow">{email}</span> est associée à un compte,
              vous recevrez un lien de réinitialisation valable <strong className="text-white/80">1 heure</strong>.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-condensed font-black text-xl uppercase tracking-wide text-white mb-2">
              Mot de passe oublié
            </h1>
            <p className="text-white/50 text-[0.8rem] mb-6">
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>

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

              {error && (
                <p className="text-red-400 text-[0.8rem] font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy py-3 hover:bg-yellow-light transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>
          </>
        )}
      </div>

      <div className="text-center mt-4 flex flex-col gap-2">
        <p className="text-white/40 text-[0.78rem]">
          <Link to="/login" className="text-yellow hover:text-yellow-light transition-colors">
            Retour à la connexion
          </Link>
        </p>
        <Link to="/" className="text-white/30 text-[0.75rem] hover:text-white/60 transition-colors">
          Retour au site
        </Link>
      </div>
    </AuthLayout>
  )
}

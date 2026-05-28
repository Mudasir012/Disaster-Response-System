import { useState } from 'react'

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ResetPassword({ email: initialEmail, onBack }) {
  const [email, setEmail] = useState(initialEmail || '')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !validateEmail(email)) {
      setError('Enter a valid email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      await new Promise((r) => setTimeout(r, 1500))
      setSent(true)
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center gap-5">
        <div className="w-14 h-14 rounded-full bg-status-teal/10 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </div>
        <div>
          <p className="text-base text-glacier-white font-semibold">
            Reset link sent
          </p>
          <p className="mt-2 text-sm text-cool-gray/70 leading-relaxed">
            If an account exists for <span className="text-glacier-white font-medium">{email}</span>,
            you'll receive a password reset link shortly.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-signal-blue hover:text-glacier-white transition-colors duration-200"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {error && (
        <div role="alert" className="rounded-lg bg-crisis-red/10 border border-crisis-red/20 px-4 py-3 text-sm text-crisis-red">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="reset-email" className="text-xs font-semibold tracking-wide text-cool-gray/80">
          Email address
        </label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          placeholder="name@agency.gov"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
          disabled={loading}
          className="w-full rounded-xl border border-white/[0.07] bg-surface px-4 py-3 text-sm text-glacier-white placeholder:text-cool-gray/40 transition-all duration-200 focus:outline-none focus:ring-[2.5px] focus:ring-signal-blue/60 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-crisis-red py-3.5 text-sm font-bold text-white tracking-wide transition-all duration-500 ease-[cubic-bezier(0.35,0,0,1)] hover:scale-[1.02] hover:shadow-[0_8px_25px_-5px_rgba(233,69,96,0.3)] active:scale-[0.97] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          'Send reset link'
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-sm font-medium text-cool-gray/60 hover:text-glacier-white transition-colors duration-200 text-center"
      >
        Back to sign in
      </button>
    </form>
  )
}

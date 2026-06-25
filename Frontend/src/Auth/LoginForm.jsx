import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LoginForm({ onForgotPassword }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleBlur = useCallback((field) => {
    if (field === 'email' && email && !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email address' }))
    } else if (field === 'email' && !email) {
      setErrors((prev) => ({ ...prev, email: '' }))
    } else if (field === 'password' && !password) {
      setErrors((prev) => ({ ...prev, password: '' }))
    }
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!email || !validateEmail(email)) newErrors.email = 'Enter a valid email address'
    if (!password) newErrors.password = 'Enter your password'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    setGeneralError('')
    try {
      await new Promise((r) => setTimeout(r, 1200))
      navigate('/dashboard')
    } catch {
      setGeneralError('Could not reach the server. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {generalError && (
        <div
          role="alert"
          className="bg-crisis-red/10 border border-crisis-red/20 px-4 py-3 text-sm text-crisis-red"
        >
          {generalError}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-xs font-mono uppercase tracking-[0.06em] text-ink/60">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="name@agency.gov"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
          onBlur={() => handleBlur('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          disabled={loading}
          className={`w-full rounded-[2px] border bg-ink/[0.03] px-4 py-3 text-sm text-ink placeholder:text-ink/40 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-acid/50 disabled:opacity-50 ${
            errors.email ? 'border-crisis-red/30' : 'border-ink/[0.07]'
          }`}
        />
        {errors.email && (
          <p id="login-email-error" className="text-xs text-crisis-red" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-xs font-mono uppercase tracking-[0.06em] text-ink/60">
            Password
          </label>
          <button
            type="button"
            onClick={() => onForgotPassword(email)}
            className="text-xs font-mono uppercase tracking-[0.06em] text-ink/50 hover:text-ink transition-colors duration-200"
          >
            Forgot?
          </button>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
            onBlur={() => handleBlur('password')}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            disabled={loading}
            className={`w-full rounded-[2px] border bg-ink/[0.03] px-4 py-3 pr-11 text-sm text-ink placeholder:text-ink/40 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-acid/50 disabled:opacity-50 ${
              errors.password ? 'border-crisis-red/30' : 'border-ink/[0.07]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition-colors duration-200 p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="text-xs text-crisis-red" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 text-sm font-bold font-mono uppercase tracking-[0.08em] text-cream bg-ink hover:bg-acid hover:text-ink transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  )
}

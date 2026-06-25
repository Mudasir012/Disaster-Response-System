import { useState } from 'react'

export default function VerifyEmail({ email, onBack }) {
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleResend = async () => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      setResent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center text-center gap-5">
      <div className="w-14 h-14 rounded-[2px] bg-ink/[0.06] flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f7ddb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>

      <div>
        <p className="text-base text-ink font-bold font-mono uppercase tracking-[0.06em]">
          Verify your email
        </p>
        <p className="mt-2 text-sm text-ink/70 leading-relaxed">
          We sent a verification link to{' '}
          <span className="text-ink font-mono">{email}</span>.
          Click the link to activate your account.
        </p>
      </div>

      {resent && (
        <p className="text-xs font-bold font-mono uppercase tracking-[0.06em] text-ink">
          Verification link resent
        </p>
      )}

      <button
        onClick={handleResend}
        disabled={loading}
        className="text-sm font-mono text-ink/50 hover:text-ink transition-colors duration-200 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Resend verification email'}
      </button>

      <button
        onClick={onBack}
        className="text-sm font-mono text-ink/70 hover:text-ink transition-colors duration-200"
      >
        Back to sign in
      </button>
    </div>
  )
}

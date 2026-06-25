import { useState, useEffect } from 'react'
import { useSearchParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

const EVENT_TYPES = [
  { value: 'earthquake', label: 'Earthquake', color: '#e94560' },
  { value: 'hurricane', label: 'Hurricane', color: '#0f7ddb' },
  { value: 'wildfire', label: 'Wildfire', color: '#f97316' },
  { value: 'flood', label: 'Flood', color: '#06b6d4' },
  { value: 'tsunami', label: 'Tsunami', color: '#0d9488' },
  { value: 'tornado', label: 'Tornado', color: '#7c3aed' },
  { value: 'volcanic_eruption', label: 'Volcanic Eruption', color: '#dc2626' },
  { value: 'landslide', label: 'Landslide', color: '#a16207' },
]

export default function AlertManage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [sub, setSub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rules, setRules] = useState([])
  const [saving, setSaving] = useState(false)
  const [unsubscribing, setUnsubscribing] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const isConfirm = window.location.pathname.includes('/alerts/confirm')

  useEffect(() => {
    if (!token) { setLoading(false); return }
    ;(async () => {
      try {
        const data = await api.getAlerts(token)
        setSub(data)
        setRules(data.rules || [])
        if (data.confirmed) setConfirming(true)
      } catch {
        setError('Subscription not found or link is invalid')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  useEffect(() => {
    if (!token || !isConfirm || confirming) return
    ;(async () => {
      try {
        await api.confirmAlert(token)
        setSub((prev) => ({ ...prev, confirmed: true }))
        setConfirming(true)
      } catch {
        // already confirmed or error
      }
    })()
  }, [token, isConfirm, confirming])

  const updateRule = (index, field, value) => {
    setRules((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const data = await api.updateAlerts(token, { rules })
      setSub(data.sub)
    } catch (err) {
      setError(err.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleUnsubscribe = async () => {
    if (!confirm('Are you sure you want to unsubscribe from all alerts?')) return
    setUnsubscribing(true)
    try {
      await api.unsubscribeAlerts(token)
      navigate('/?unsubscribed=true')
    } catch {
      setError('Failed to unsubscribe')
      setUnsubscribing(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-[100dvh] bg-cream flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-ink/60 font-mono mb-4">No subscription token provided</p>
          <Link to="/subscribe" className="px-4 py-2 text-xs font-mono uppercase tracking-[0.08em] bg-ink text-cream hover:bg-acid hover:text-ink transition-all">
            Subscribe to Alerts
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-ink/10 border-t-ink animate-spin" />
          <span className="text-[10px] text-ink/60 font-mono uppercase tracking-[0.12em]">Loading subscription...</span>
        </div>
      </div>
    )
  }

  if (error && !sub) {
    return (
      <div className="min-h-[100dvh] bg-cream flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-crisis-red/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-crisis-red text-lg font-bold">!</span>
          </div>
          <p className="text-sm text-crisis-red font-mono mb-2 uppercase tracking-[0.06em]">Invalid Link</p>
          <p className="text-[11px] text-ink/60 font-mono mb-6">{error}</p>
          <Link to="/subscribe" className="px-4 py-2 text-xs font-mono uppercase tracking-[0.08em] bg-ink text-cream hover:bg-acid hover:text-ink transition-all">
            Subscribe to Alerts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-base font-bold text-ink font-mono uppercase tracking-[0.08em]">
              {isConfirm && !confirming ? 'Confirming...' : 'Manage Alerts'}
            </h1>
            <p className="text-[11px] text-ink/60 font-mono mt-0.5">{sub?.email}</p>
          </div>
          <Link to="/" className="text-[10px] text-ink/50 font-mono hover:text-ink transition-all uppercase tracking-[0.06em]">
            Back
          </Link>
        </div>

        {isConfirm && confirming && (
          <div className="px-5 py-4 border border-acid/30 bg-acid/10 mb-6 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DCFF34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <p className="text-xs font-bold text-ink font-mono uppercase tracking-[0.06em]">Subscription confirmed!</p>
              <p className="text-[10px] text-ink/60 font-mono">You'll now receive alerts for your selected area.</p>
            </div>
          </div>
        )}

        {rules.map((rule, i) => (
          <div key={i} className="border border-ink/10 bg-ink/[0.02] p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-ink font-mono uppercase tracking-[0.06em]">Rule {i + 1}</h2>
              {rules.length > 1 && (
                <button
                  onClick={() => {
                    const next = rules.filter((_, idx) => idx !== i)
                    setRules(next)
                  }}
                  className="px-2 py-1 text-[9px] font-mono text-crisis-red/60 hover:text-crisis-red border border-crisis-red/20 transition-all cursor-pointer uppercase tracking-[0.06em]"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-mono text-ink/50 uppercase tracking-[0.1em] mb-1.5 block">Region</label>
                <input
                  value={rule.region || ''}
                  onChange={(e) => updateRule(i, 'region', e.target.value)}
                  className="w-full px-3 py-2 border border-ink/10 bg-ink/[0.03] text-ink text-xs font-mono focus:outline-none focus:border-acid/50 transition-all"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-ink/50 uppercase tracking-[0.1em] mb-1.5 block">
                  Types <span className="text-ink/40">(empty = all)</span>
                </label>
                <div className="flex flex-wrap gap-1">
                  {EVENT_TYPES.map((t) => {
                    const active = rule.event_types?.includes(t.value)
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => {
                          const types = rule.event_types || []
                          const next = active ? types.filter((v) => v !== t.value) : [...types, t.value]
                          updateRule(i, 'event_types', next)
                        }}
                        className={`px-2 py-1 text-[9px] font-mono border transition-all cursor-pointer ${
                          active ? 'text-ink' : 'text-ink/50 border-ink/10 hover:text-ink'
                        }`}
                        style={{
                          background: active ? `${t.color}20` : 'transparent',
                          borderColor: active ? t.color : undefined,
                        }}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono text-ink/50 uppercase tracking-[0.1em] mb-1.5 block">
                  Min Severity: <span className="text-ink">{rule.min_severity || 1}+</span>
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateRule(i, 'min_severity', s)}
                      className={`flex-1 px-1 py-1.5 text-[9px] font-mono border transition-all cursor-pointer ${
                        (rule.min_severity || 1) === s
                          ? 'bg-ink text-cream border-ink'
                          : 'text-ink/50 border-ink/10 hover:text-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {error && (
          <div className="px-4 py-3 border border-crisis-red/20 bg-crisis-red/10 text-xs font-mono text-crisis-red mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 text-xs font-mono font-bold uppercase tracking-[0.08em] text-cream bg-ink hover:bg-acid hover:text-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleUnsubscribe}
            disabled={unsubscribing}
            className="px-4 py-2.5 text-xs font-mono text-crisis-red/70 border border-crisis-red/30 hover:bg-crisis-red/10 hover:text-crisis-red transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer uppercase tracking-[0.06em]"
          >
            {unsubscribing ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={async () => {
              try {
                await api.testAlert(token, 0)
                alert('Test alert sent! Check your email.')
              } catch {
                alert('Failed to send test alert.')
              }
            }}
            className="text-[10px] text-ink/40 font-mono underline underline-offset-2 hover:text-ink/60 transition-all cursor-pointer"
          >
            Send test alert
          </button>
        </div>
      </div>
    </div>
  )
}

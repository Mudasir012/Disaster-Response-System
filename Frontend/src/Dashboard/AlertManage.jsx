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
      <div className="min-h-[100dvh] bg-landing-bg flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-cool-gray/70 font-mono mb-4">No subscription token provided</p>
          <Link to="/subscribe" className="px-4 py-2 text-xs font-mono rounded-lg bg-purple-500/30 text-purple-700 border border-purple-500/30 hover:bg-purple-500/40 transition-all">
            Subscribe to Alerts
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-landing-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-purple-500 animate-spin" />
          <span className="text-[10px] text-cool-gray/70 font-mono uppercase tracking-widest">Loading subscription...</span>
        </div>
      </div>
    )
  }

  if (error && !sub) {
    return (
      <div className="min-h-[100dvh] bg-landing-bg flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-crisis-red/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-crisis-red text-lg font-bold">!</span>
          </div>
          <p className="text-sm text-crisis-red font-mono mb-2">Invalid Link</p>
          <p className="text-[11px] text-cool-gray/70 font-mono mb-6">{error}</p>
          <Link to="/subscribe" className="px-4 py-2 text-xs font-mono rounded-lg bg-purple-500/30 text-purple-700 border border-purple-500/30 hover:bg-purple-500/40 transition-all">
            Subscribe to Alerts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-landing-bg flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-base font-bold text-white font-mono tracking-wide">
              {isConfirm && !confirming ? 'Confirming...' : 'Manage Alerts'}
            </h1>
            <p className="text-[11px] text-cool-gray/70 font-mono mt-0.5">{sub?.email}</p>
          </div>
          <Link to="/" className="text-[10px] text-cool-gray/70 font-mono hover:text-white transition-all">
            ← Home
          </Link>
        </div>

        {isConfirm && confirming && (
          <div className="px-5 py-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-green-700 font-mono">Subscription confirmed!</p>
              <p className="text-[10px] text-green-700/60 font-mono">You'll now receive alerts for your selected area.</p>
            </div>
          </div>
        )}

        {rules.map((rule, i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-white font-mono">Rule {i + 1}</h2>
              {rules.length > 1 && (
                <button
                  onClick={() => {
                    const next = rules.filter((_, idx) => idx !== i)
                    setRules(next)
                  }}
                  className="px-2 py-1 text-[9px] font-mono text-crisis-red/60 hover:text-crisis-red border border-crisis-red/20 rounded transition-all cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-mono text-cool-gray/70 uppercase tracking-wider mb-1.5 block">Region</label>
                <input
                  value={rule.region || ''}
                  onChange={(e) => updateRule(i, 'region', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white text-xs font-mono
                    focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-cool-gray/70 uppercase tracking-wider mb-1.5 block">
                  Types <span className="text-cool-gray/65">(empty = all)</span>
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
                        className={`px-2 py-1 rounded text-[9px] font-mono border transition-all cursor-pointer ${
                          active ? 'text-white' : 'text-cool-gray/70 border-white/5 hover:text-white'
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
                <label className="text-[9px] font-mono text-cool-gray/70 uppercase tracking-wider mb-1.5 block">
                  Min Severity: <span className="text-glacier-white">{rule.min_severity || 1}+</span>
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateRule(i, 'min_severity', s)}
                      className={`flex-1 px-1 py-1.5 rounded text-[9px] font-mono border transition-all cursor-pointer ${
                        (rule.min_severity || 1) === s
                          ? 'bg-white/10 text-white border-white/20'
                          : 'text-cool-gray/70 border-white/5 hover:text-white'
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
          <div className="px-4 py-3 rounded-xl bg-crisis-red/10 border border-crisis-red/20 text-xs font-mono text-crisis-red mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-xs font-mono font-semibold text-on-accent bg-purple-500/80 hover:bg-purple-500
              transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleUnsubscribe}
            disabled={unsubscribing}
            className="px-4 py-2.5 rounded-xl text-xs font-mono text-crisis-red/70 border border-crisis-red/30 hover:bg-crisis-red/10 hover:text-crisis-red
              transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
            className="text-[10px] text-cool-gray/65 font-mono underline underline-offset-2 hover:text-cool-gray/75 transition-all cursor-pointer"
          >
            Send test alert
          </button>
        </div>
      </div>
    </div>
  )
}

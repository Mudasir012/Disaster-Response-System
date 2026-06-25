import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

const SEVERITY_LEVELS = [
  { value: 1, label: '1 - Minor' },
  { value: 2, label: '2 - Low' },
  { value: 3, label: '3 - Moderate' },
  { value: 4, label: '4 - Severe' },
  { value: 5, label: '5 - Critical' },
]

export default function AlertSubscribe() {
  const [step, setStep] = useState('form')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [minSeverity, setMinSeverity] = useState(3)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debounceRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const fetchSuggestions = useCallback(async (q) => {
    if (q.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    try {
      const [countries, cities] = await Promise.all([
        api.gdeltCountries(q).catch(() => ({ countries: [] })),
        api.gdeltCities(q).catch(() => ({ cities: [] })),
      ])
      const combined = [
        ...(countries.countries || []).map((c) => ({ label: c.name, type: 'country' })),
        ...(cities.cities || []).map((c) => ({ label: `${c.name}, ${c.countryName || c.country}`, type: 'city' })),
      ].slice(0, 12)
      setSuggestions(combined)
      setShowSuggestions(combined.length > 0)
      setSelectedIndex(-1)
    } catch {
      setSuggestions([])
    }
  }, [])

  const handleLocationChange = (e) => {
    const val = e.target.value
    setLocation(val)
    setSelectedIndex(-1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 200)
  }

  const selectLocation = (label) => {
    setLocation(label)
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const toggleType = (value) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (!location.trim()) {
      setError('Please enter a location')
      return
    }

    setSaving(true)
    try {
      const data = await api.subscribeAlerts({
        email,
        rules: [{
          region: location.trim(),
          event_types: selectedTypes,
          min_severity: minSeverity,
        }],
      })
      setResult(data)
      setStep('success')
    } catch (err) {
      setError(err.message || 'Failed to subscribe')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      selectLocation(suggestions[selectedIndex].label)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-[100dvh] bg-cream flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-5 border border-acid bg-acid/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DCFF34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-ink font-mono uppercase tracking-[0.08em] mb-2">Almost there!</h1>
          <p className="text-sm text-ink/65 font-mono leading-relaxed mb-6">
            We sent a confirmation email to <span className="text-ink font-bold">{email}</span>.
            Click the link to activate alerts for <span className="text-ink font-bold">{location}</span>.
          </p>
          <div className="border border-ink/10 p-5 mb-6 text-left">
            <p className="text-[10px] text-ink/50 font-mono uppercase tracking-[0.12em] mb-3">Your subscription</p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between"><span className="text-ink/60">Location</span><span className="text-ink">{location}</span></div>
              <div className="flex justify-between"><span className="text-ink/60">Min. Severity</span><span className="text-ink">{minSeverity}+</span></div>
              <div className="flex justify-between"><span className="text-ink/60">Types</span><span className="text-ink">{selectedTypes.length ? selectedTypes.join(', ') : 'All'}</span></div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/dashboard" className="px-4 py-2 text-xs font-mono uppercase tracking-[0.08em] bg-ink text-cream hover:bg-acid hover:text-ink transition-all">
              Go to Dashboard
            </Link>
            <Link to={`/alerts/manage?token=${result?.token}`} className="px-4 py-2 text-xs font-mono uppercase tracking-[0.08em] border border-ink/20 text-ink/70 hover:text-ink hover:border-ink/40 transition-all">
              Manage Subscription
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="w-8 h-8 bg-ink/[0.06] flex items-center justify-center text-ink/60 hover:text-ink hover:bg-ink/[0.1] transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-base font-bold text-ink font-mono uppercase tracking-[0.08em]">Get Disaster Alerts</h1>
            <p className="text-[11px] text-ink/60 font-mono mt-0.5">Receive email alerts when a disaster occurs</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-mono text-ink/50 uppercase tracking-[0.12em] mb-2 block">
              Location <span className="text-crisis-red">*</span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={location}
                onChange={handleLocationChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                placeholder="Country, city, or area..."
                className="w-full px-4 py-3 border border-ink/10 bg-ink/[0.03] text-ink text-sm font-mono placeholder:text-ink/40 focus:outline-none focus:border-acid/50 transition-all"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-cream border border-ink/10 shadow-[0_12px_40px_-12px_#16150F/0.25] overflow-hidden z-50">
                  {suggestions.map((s, i) => (
                    <button
                      key={`${s.type}-${s.label}`}
                      type="button"
                      onMouseDown={() => selectLocation(s.label)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs font-mono transition-colors ${
                        i === selectedIndex ? 'bg-ink/[0.08] text-ink' : 'text-ink/60 hover:bg-ink/[0.04] hover:text-ink'
                      }`}
                    >
                      <span className={`text-[9px] uppercase ${s.type === 'country' ? 'text-ink/70' : 'text-ink/50'}`}>
                        {s.type === 'country' ? '[CTRY]' : '[CITY]'}
                      </span>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-ink/50 uppercase tracking-[0.12em] mb-2 block">
              Email <span className="text-crisis-red">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-ink/10 bg-ink/[0.03] text-ink text-sm font-mono placeholder:text-ink/40 focus:outline-none focus:border-acid/50 transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-ink/50 uppercase tracking-[0.12em] mb-2 block">
              Disaster Types <span className="text-ink/40">(leave empty for all)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleType(t.value)}
                  className={`px-3 py-1.5 text-[11px] font-mono border transition-all cursor-pointer ${
                    selectedTypes.includes(t.value)
                      ? 'text-ink'
                      : 'text-ink/50 border-ink/10 hover:text-ink hover:border-ink/30'
                  }`}
                  style={{
                    background: selectedTypes.includes(t.value) ? `${t.color}20` : 'transparent',
                    borderColor: selectedTypes.includes(t.value) ? t.color : undefined,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-ink/50 uppercase tracking-[0.12em] mb-2 block">
              Minimum Severity: <span className="text-ink">{minSeverity}+</span>
            </label>
            <div className="flex gap-1.5">
              {SEVERITY_LEVELS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setMinSeverity(s.value)}
                  className={`flex-1 px-2 py-2 text-[10px] font-mono border transition-all cursor-pointer ${
                    minSeverity === s.value
                      ? 'bg-ink text-cream border-ink'
                      : 'text-ink/50 border-ink/10 hover:text-ink hover:border-ink/30'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 border border-crisis-red/20 bg-crisis-red/10 text-xs font-mono text-crisis-red">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !email || !location.trim()}
            className="w-full py-3 text-sm font-mono font-bold uppercase tracking-[0.1em] text-cream bg-ink hover:bg-acid hover:text-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border border-cream/30 border-t-cream animate-spin" />
                Subscribing...
              </span>
            ) : (
              'Subscribe to Alerts'
            )}
          </button>

          <p className="text-[10px] text-ink/40 font-mono text-center">
            By subscribing, you agree to receive email alerts about disasters in your selected area.
            You can unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  )
}

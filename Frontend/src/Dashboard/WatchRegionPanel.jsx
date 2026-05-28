import { useState } from 'react'

const POPULAR_CITIES = [
  { name: 'Tokyo, Japan', lat: 35.7, lng: 139.7 },
  { name: 'Los Angeles, USA', lat: 34.1, lng: -118.2 },
  { name: 'Miami, USA', lat: 25.8, lng: -80.2 },
  { name: 'Jakarta, Indonesia', lat: -6.2, lng: 106.8 },
  { name: 'Mexico City, Mexico', lat: 19.4, lng: -99.1 },
  { name: 'Istanbul, Turkey', lat: 41.0, lng: 28.9 },
  { name: 'Manila, Philippines', lat: 14.6, lng: 121.0 },
  { name: 'Bangkok, Thailand', lat: 13.7, lng: 100.5 },
  { name: 'San Francisco, USA', lat: 37.8, lng: -122.4 },
  { name: 'Santiago, Chile', lat: -33.5, lng: -70.7 },
]

export default function WatchRegionPanel({ open, onClose }) {
  const [regions, setRegions] = useState([])
  const [search, setSearch] = useState('')

  const results = search.trim()
    ? POPULAR_CITIES.filter(
        (c) => c.name.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const addRegion = (city) => {
    if (regions.some((r) => r.name === city.name)) return
    setRegions([...regions, { ...city, notifyEmail: true, notifyInApp: true }])
    setSearch('')
  }

  const removeRegion = (name) => {
    setRegions(regions.filter((r) => r.name !== name))
  }

  const togglePref = (name, field) => {
    setRegions(
      regions.map((r) =>
        r.name === name ? { ...r, [field]: !r[field] } : r
      )
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-deep-slate border-l border-white/[0.06] h-full flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
          <h2 className="font-sora text-base font-bold text-glacier-white">Monitored Regions</h2>
          <button onClick={onClose} className="text-cool-gray/50 hover:text-glacier-white transition-colors duration-200" aria-label="Close panel">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5 border-b border-white/[0.04]">
          <div className="relative">
            <svg aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cool-gray/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search cities or countries..."
              aria-label="Search cities or countries"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.07] bg-surface px-4 py-3 pl-10 text-sm text-glacier-white placeholder:text-cool-gray/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-signal-blue/50"
            />
          </div>
          {search.trim() && results.length > 0 && (
            <div className="mt-2 space-y-1">
              {results.map((city) => {
                const added = regions.some((r) => r.name === city.name)
                return (
                  <button
                    key={city.name}
                    onClick={() => addRegion(city)}
                    disabled={added}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      added
                        ? 'text-cool-gray/30 cursor-not-allowed'
                        : 'text-glacier-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="font-medium">{city.name}</span>
                    <span className="ml-2 text-[11px] text-cool-gray/50">
                      {city.lat.toFixed(1)}, {city.lng.toFixed(1)}
                    </span>
                    {added && <span className="float-right text-[10px] text-status-teal">Added</span>}
                  </button>
                )
              })}
            </div>
          )}
          {search.trim() && results.length === 0 && (
            <p className="mt-3 text-xs text-cool-gray/40 text-center">No locations found. Try a different name.</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {regions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg aria-hidden="true" className="w-10 h-10 text-cool-gray/20 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-sm text-cool-gray/40 font-medium">No regions monitored</p>
              <p className="text-xs text-cool-gray/30 mt-1">Search for a city above to start monitoring</p>
            </div>
          ) : (
            <div className="space-y-3">
              {regions.map((region) => (
                <div key={region.name} className="bg-surface rounded-xl border border-white/[0.04] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-glacier-white">{region.name}</p>
                      <p className="text-[11px] font-mono text-cool-gray/40 mt-0.5">
                        {region.lat.toFixed(2)}, {region.lng.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeRegion(region.name)}
                      className="text-cool-gray/30 hover:text-crisis-red transition-colors duration-200 p-1"
                      aria-label={`Remove ${region.name}`}
                    >
                      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.04]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={region.notifyInApp}
                        onChange={() => togglePref(region.name, 'notifyInApp')}
                        className="w-3.5 h-3.5 rounded border-white/20 bg-surface accent-signal-blue"
                      />
                      <span className="text-[11px] text-cool-gray/50">In-app</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={region.notifyEmail}
                        onChange={() => togglePref(region.name, 'notifyEmail')}
                        className="w-3.5 h-3.5 rounded border-white/20 bg-surface accent-signal-blue"
                      />
                      <span className="text-[11px] text-cool-gray/50">Email</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {regions.length > 0 && (
          <div className="p-5 border-t border-white/[0.04]">
            <p className="text-[11px] text-cool-gray/40">
              Notifications are sent when an incident occurs within 200km of a monitored region.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

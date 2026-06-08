import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'

export default function WatchRegionPanel({ open, onClose, selectedCountry, onCountryChange }) {
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  const fetchSuggestions = useCallback(async (q) => {
    if (q.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    try {
      const result = await api.gdeltCountries(q)
      setSuggestions(result.countries || [])
      setShowSuggestions(result.countries?.length > 0)
      setSelectedIndex(-1)
    } catch {
      setSuggestions([])
    }
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setSearch(val)
    setSelectedIndex(-1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 200)
  }

  const selectCountry = (country) => {
    onCountryChange(country)
    setSearch('')
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const clearFilter = () => {
    onCountryChange(null)
    setSearch('')
    setSuggestions([])
    setShowSuggestions(false)
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
      selectCountry(suggestions[selectedIndex].name)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-deep-slate border-l border-white/[0.06] h-full flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f7ddb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h2 className="font-sora text-base font-bold text-glacier-white">Filter by Country</h2>
          </div>
          <button onClick={onClose} className="text-cool-gray/50 hover:text-glacier-white transition-colors duration-200" aria-label="Close panel">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 border-b border-white/[0.04]">
          <div className="relative">
            <svg aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cool-gray/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for a country..."
              aria-label="Search countries"
              value={search}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full rounded-xl border border-white/[0.07] bg-surface px-4 py-3 pl-10 text-sm text-glacier-white placeholder:text-cool-gray/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-signal-blue/50"
            />
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-deep-slate/95 backdrop-blur-xl border border-white/[0.06] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                >
                  {suggestions.map((c, i) => (
                    <button
                      key={c.code}
                      type="button"
                      onMouseDown={() => selectCountry(c.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 ${
                        i === selectedIndex ? 'bg-white/[0.08] text-glacier-white' : 'text-cool-gray/70 hover:bg-white/[0.04] hover:text-glacier-white'
                      }`}
                    >
                      <span className={`w-5 h-3.5 rounded inline-flex items-center justify-center text-[8px] font-bold uppercase ${i === selectedIndex ? 'text-glacier-white/60' : 'text-cool-gray/40'}`}>
                        {c.code}
                      </span>
                      <span className="text-sm">{c.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {selectedCountry ? (
            <div className="space-y-4">
              <div className="bg-[#0f7ddb]/10 rounded-xl border border-[#0f7ddb]/20 p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-[#0f7ddb]/20 flex items-center justify-center mx-auto mb-3">
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f7ddb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-glacier-white mb-1">Showing disasters in</p>
                <p className="text-lg font-bold text-[#0f7ddb]">{selectedCountry}</p>
              </div>

              <button
                onClick={clearFilter}
                className="w-full py-2.5 rounded-lg border border-crisis-red/30 text-xs font-medium text-crisis-red/70 hover:bg-crisis-red/10 hover:text-crisis-red transition-all duration-200"
              >
                Clear filter & show global
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg aria-hidden="true" className="w-10 h-10 text-cool-gray/20 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <p className="text-sm text-cool-gray/40 font-medium">No country selected</p>
              <p className="text-xs text-cool-gray/30 mt-1">Search for a country above to see its disasters</p>
              <p className="text-xs text-cool-gray/30 mt-4">Currently showing: <span className="text-glacier-white/60 font-medium">Worldwide</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Search, Bell, Radio } from 'lucide-react'
import { useFilterStore } from '../../store/useFilterStore'

const navLinks = [
  { path: '/map', label: 'Live Map' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/alerts', label: 'Alerts' },
  { path: '/about', label: 'About' },
]

export default function Navbar({ transparent = false, activeCount = 0, connected = false }) {
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchClosing, setSearchClosing] = useState(false)
  const { search, setSearch } = useFilterStore()

  const isLanding = location.pathname === '/'
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) return null

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-300 ${
      transparent && isLanding ? 'bg-transparent' : 'bg-deep-slate/90 backdrop-blur-xl'
    } border-b border-white/[0.06]`}>
      <div className="h-full px-4 flex items-center justify-between max-w-[1920px] mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-crisis-red animate-pulse-ring' : 'bg-cool-gray'} transition-colors`} />
            <span className="text-glacier-white font-bold text-lg tracking-tight">DisasterTracker</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-glacier-white bg-white/10'
                    : 'text-cool-gray hover:text-glacier-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(searchOpen || searchClosing) && (
            <div className={`absolute top-14 left-0 right-0 md:relative md:top-0 bg-deep-slate md:bg-transparent p-3 md:p-0 border-b border-white/10 md:border-0 ${
              searchClosing ? 'animate-slide-down' : 'animate-slide-up'
            }`}>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cool-gray" />
                <input
                  type="text"
                  placeholder="Search incidents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-72 bg-surface border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-glacier-white placeholder-cool-gray/50 focus:outline-none focus:border-signal-blue/50 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cool-gray hover:text-glacier-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
          <button onClick={() => {
              if (searchOpen) {
                setSearchClosing(true)
                setTimeout(() => { setSearchOpen(false); setSearchClosing(false) }, 250)
              } else {
                setSearchOpen(true)
              }
            }}
            aria-label={searchOpen || searchClosing ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            className="p-2.5 rounded-md text-cool-gray hover:text-glacier-white hover:bg-white/5 transition-colors">
            <Search size={16} />
          </button>

          {activeCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-crisis-red/15 text-crisis-red text-xs font-semibold px-2.5 py-1 rounded-full">
              <Radio size={12} />
              <span>{activeCount} Active</span>
            </div>
          )}

          <Link to="/alerts" aria-label="View alerts" className="relative p-2.5 rounded-md text-cool-gray hover:text-glacier-white hover:bg-white/5 transition-colors">
            <Bell size={16} />
          </Link>

          <Link to="/map" className="hidden sm:inline-flex items-center gap-2 bg-crisis-red hover:bg-crisis-red/90 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-crisis-red/20">
            <Radio size={14} />
            <span>Open Live Map</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

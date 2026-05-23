import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Search, Bell, Activity, Radio, User } from 'lucide-react'

const navLinks = [
  { path: '/map', label: 'Live Map' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/alerts', label: 'Alerts' },
  { path: '/about', label: 'About' },
]

export default function Navbar({ transparent = false, activeCount = 0, connected = false }) {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const isLanding = location.pathname === '/'
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) return null

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-300 ${
      transparent && isLanding ? 'bg-transparent' : 'bg-deep-slate/95 backdrop-blur-md'
    } border-b border-white/10`}>
      <div className="h-full px-4 flex items-center justify-between max-w-[1920px] mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-crisis-red animate-pulse-ring' : 'bg-cool-gray'}`} />
            <span className="text-glacier-white font-bold text-lg tracking-tight">DisasterTracker</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
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

        <div className="flex items-center gap-3">
          {searchOpen && (
            <div className="absolute top-14 left-0 right-0 md:relative md:top-0 bg-deep-slate md:bg-transparent p-3 md:p-0 border-b border-white/10 md:border-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cool-gray" />
                <input
                  type="text"
                  placeholder="Search incidents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-64 bg-surface border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-glacier-white placeholder-cool-gray focus:outline-none focus:border-signal-blue/50"
                />
              </div>
            </div>
          )}
          <button onClick={() => setSearchOpen(!searchOpen)}
            className="p-1.5 rounded-md text-cool-gray hover:text-glacier-white hover:bg-white/5 transition-colors md:hidden">
            <Search size={16} />
          </button>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden md:block p-1.5 rounded-md text-cool-gray hover:text-glacier-white hover:bg-white/5 transition-colors"
          >
            <Search size={16} />
          </button>

          {activeCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-crisis-red/20 text-crisis-red text-xs font-semibold px-2.5 py-1 rounded-full">
              <Radio size={12} />
              <span>{activeCount} Active</span>
            </div>
          )}

          <Link to="/alerts" className="relative p-1.5 rounded-md text-cool-gray hover:text-glacier-white hover:bg-white/5 transition-colors">
            <Bell size={16} />
          </Link>

          <Link to="/map" className="hidden sm:inline-flex items-center gap-1.5 bg-crisis-red hover:bg-crisis-red/90 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-[1.02]">
            <Activity size={14} />
            <span>Open Live Map</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

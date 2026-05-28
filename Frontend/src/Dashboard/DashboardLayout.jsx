import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from './constants'
import NotificationBell from './NotificationBell'

export default function DashboardLayout({ children, onWatchRegions }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-[100dvh] bg-deep-slate flex flex-col">
      <header className="sticky top-0 z-30 bg-deep-slate/90 backdrop-blur-md border-b border-white/[0.04]">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-8">
            <NavLink to="/dashboard" className="font-sora text-base font-bold tracking-tight text-glacier-white flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-crisis-red" />
              DisasterTracker
            </NavLink>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/[0.08] text-glacier-white'
                        : 'text-cool-gray/70 hover:text-glacier-white hover:bg-white/[0.04]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={onWatchRegions}
                className="px-3.5 py-1.5 text-sm font-medium rounded-lg text-cool-gray/70 hover:text-glacier-white hover:bg-white/[0.04] transition-all duration-200 flex items-center gap-2"
              >
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Regions
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-7 h-7 rounded-full bg-signal-blue/20 flex items-center justify-center transition-all duration-200 hover:bg-signal-blue/30"
                aria-label="User menu"
              >
                <span className="text-[11px] font-semibold text-signal-blue">ER</span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-9 z-40 w-44 bg-deep-slate/95 backdrop-blur-xl border border-white/[0.06] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.04]">
                      <p className="text-xs font-semibold text-glacier-white">Elena Rivera</p>
                      <p className="text-[10px] text-cool-gray/40">elena.rivera@disastertracker.io</p>
                    </div>
                    <div className="py-1">
                      {['Profile', 'Settings'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setMenuOpen(false)}
                          className="w-full px-4 py-2 text-xs text-cool-gray/70 hover:text-glacier-white hover:bg-white/[0.04] text-left transition-colors duration-150"
                        >
                          {item}
                        </button>
                      ))}
                      <hr className="mx-3 border-white/[0.04]" />
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-full px-4 py-2 text-xs text-crisis-red/70 hover:text-crisis-red hover:bg-white/[0.04] text-left transition-colors duration-150"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
    </div>
  )
}

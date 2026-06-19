import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { NAV_LINKS } from './constants'
import NotificationBell from './NotificationBell'

export default function DashboardLayout({ children, onWatchRegions, selectedCountry, onClearCountry }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setProgress(v)
      setScrolled(v > 0.02)
    })
  }, [scrollYProgress])

  return (
    <div className="min-h-[100dvh] bg-deep-slate flex flex-col">
      {/* Scroll progress bar */}
      <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-label="Page scroll progress">
        <div className="scroll-progress-track" />
        <div className="scroll-progress-bar" style={{ '--progress': progress }} />
      </div>

      <header
        className={`sticky top-0 z-30 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.1,1)]
          ${scrolled
            ? 'bg-deep-slate/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
            : 'bg-deep-slate/80 border-b border-white/[0.04]'
          }`}
      >
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-8">
            <NavLink to="/dashboard" className="font-sora text-base font-bold tracking-tight text-glacier-white flex items-center gap-2.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-crisis-red transition-transform duration-300 group-hover:scale-125" />
              DisasterTracker
            </NavLink>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ease-[cubic-bezier(0.4,0,0.1,1)] ${
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
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ease-[cubic-bezier(0.4,0,0.1,1)] flex items-center gap-2 ${
                  selectedCountry
                    ? 'bg-signal-blue/15 text-signal-blue'
                    : 'text-cool-gray/70 hover:text-glacier-white hover:bg-white/[0.04]'
                }`}
              >
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {selectedCountry ? selectedCountry : 'Regions'}
              </button>
              <NavLink
                to="/subscribe"
                className="px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ease-[cubic-bezier(0.4,0,0.1,1)]
                  bg-signal-blue/15 text-signal-blue/90 border border-signal-blue/20
                  hover:bg-signal-blue/25 hover:text-signal-blue inline-flex items-center gap-2"
              >
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9 22 2z" />
                </svg>
                Get Alerts
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-7 h-7 rounded-full bg-signal-blue/20 flex items-center justify-center transition-all duration-300 hover:bg-signal-blue/30 hover:scale-105 active:scale-95"
                aria-label="User menu"
              >
                <span className="text-[11px] font-semibold text-signal-blue">ER</span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.1, 1] }}
                    className="absolute right-0 top-9 z-40 w-44 bg-deep-slate/95 backdrop-blur-xl border border-white/[0.06] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden"
                  >
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
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Subtle cross decorations at layout corners */}
      <div className="pointer-events-none fixed top-14 left-4 text-cool-gray/[0.04] z-20">
        <span className="cross" />
      </div>
      <div className="pointer-events-none fixed top-14 right-4 text-cool-gray/[0.04] z-20">
        <span className="cross" />
      </div>

      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
    </div>
  )
}

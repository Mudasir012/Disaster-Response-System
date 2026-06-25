import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Nav from '../Nav'
import Footer from '../components/Footer'
import {
  easePremium, AcidStar, MarqueeTicker,
  useScrollReveal, Counter, GrainyRender
} from '../components/shared'
import { api } from '../../lib/api'

const marqueePhrases = [
  'SEISMIC MONITORING', 'SATELLITE IMAGERY', 'HURRICANE TRACKING',
  'AI CLASSIFICATION', 'REAL-TIME ALERTS', 'MULTI-SOURCE FUSION',
  'GLOBAL COVERAGE', 'CRITICAL EVENT DETECTION', 'DISASTER RESPONSE',
]

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  const [liveStats, setLiveStats] = useState(null)
  const fetchLive = useCallback(async () => {
    try {
      const overview = await api.analyticsOverview().catch(() => null)
      setLiveStats(overview)
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchLive()
    const interval = setInterval(fetchLive, 45_000)
    return () => clearInterval(interval)
  }, [fetchLive])

  useEffect(() => {
    return scrollYProgress.on('change', (v) => setProgress(v))
  }, [scrollYProgress])

  const activeCount = liveStats?.active ?? liveStats?.total ?? 0

  return (
    <div className="landing relative min-h-screen bg-cream text-ink overflow-x-hidden">
      <a href="#main-content" className="skip-link">Skip to content</a>

      <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-label="Page scroll progress">
        <div className="scroll-progress-track" />
        <div className="scroll-progress-bar" style={{ '--progress': progress, background: 'var(--color-acid)' }} />
      </div>

      <Nav />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden" id="main-content">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 40%, #1E3A2A 0%, #0f1a14 50%, #0a0f0c 100%)' }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1200 900" preserveAspectRatio="none">
            {[80, 160, 240, 320, 400, 500, 620].map((r, i) => (
              <circle key={i} cx="720" cy="360" r={r} fill="none" stroke="white" strokeWidth="0.8" strokeDasharray={`${2 + i} ${4 + i * 2}`} />
            ))}
            {[0, 30, 60, 90, 120, 150].map((angle, i) => (
              <line key={`rad${i}`} x1="720" y1="360"
                x2={720 + Math.cos(angle * Math.PI / 180) * 620}
                y2={360 + Math.sin(angle * Math.PI / 180) * 620}
                stroke="white" strokeWidth="0.5" opacity="0.4" />
            ))}
          </svg>
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1200 900" preserveAspectRatio="none">
            {[100, 200, 350, 500, 650, 780].map((y, i) => (
              <path key={i}
                d={`M0 ${y} C ${150 + i * 60} ${y - 30 - i * 5}, ${300 + i * 40} ${y + 40 + i * 8}, 450 ${y} C ${600 - i * 30} ${y - 20}, ${750} ${y + 25}, 900 ${y} C ${1000} ${y - 15}, ${1100} ${y + 10}, 1200 ${y}`}
                fill="none" stroke="white" strokeWidth="0.8" />
            ))}
          </svg>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px',
            }} />
          {[
            { x: 18, y: 28 }, { x: 48, y: 22 }, { x: 72, y: 35 },
            { x: 32, y: 58 }, { x: 62, y: 62 }, { x: 85, y: 55 },
          ].map((pos, i) => (
            <motion.span key={i}
              className="absolute h-1 w-1 rounded-full bg-acid/50"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              animate={reduced ? {} : { opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }} />
          ))}
        </div>

        <div className="relative z-10 pt-28 px-6 md:px-10">
          <motion.div {...useScrollReveal()} className="flex items-center gap-3">
            <AcidStar size="sm" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage/70">
              Real-Time Disaster Intelligence
            </span>
            {activeCount > 0 && (
              <span className="font-mono text-[10px] tabular-nums text-acid/80">
                {activeCount} active
              </span>
            )}
          </motion.div>
        </div>

        <div className="relative z-10">
          <MarqueeTicker phrases={marqueePhrases} />
        </div>

        <div className="relative z-10 flex justify-between items-end px-6 md:px-10">
          <motion.span {...useScrollReveal(0.1)}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-sage/50 max-w-[120px] leading-relaxed">
            Global monitoring across 6 authoritative sources
          </motion.span>
          <motion.span {...useScrollReveal(0.2)}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-sage/50 max-w-[140px] leading-relaxed text-right">
            AI-powered severity classification in real time
          </motion.span>
        </div>

        <div className="relative z-10 bleed-section pb-8 md:pb-12">
          <motion.h1
            initial={reduced ? {} : { opacity: 0, y: 60 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: easePremium }}
            className="bleed-headline text-cream text-[clamp(28px,5.5vw,80px)] px-2 md:whitespace-nowrap">
            SEE WHAT MATTERS BEFORE ANYONE ELSE
          </motion.h1>
        </div>

        <div className="relative z-10 pb-6 px-6 md:px-10">
          <motion.div {...useScrollReveal(0.3)} className="flex items-center gap-4">
            <Link to="/demo"
              className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sage/60 hover:text-acid transition-colors duration-300">
              <span>View Demo</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span className="hairline flex-1 text-sage/20" />
          </motion.div>
        </div>
      </section>

      {/* ═══ BRIEF VALUE + DEMO PREVIEW ═══ */}
      <section className="relative bg-cream py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <motion.div {...useScrollReveal()} className="lg:col-span-5">
              <h2 className="font-display text-[clamp(36px,5vw,72px)] font-extrabold uppercase leading-[0.94] tracking-[-0.015em] text-ink">
                ONE<br />PIPELINE.<br />ONE PICTURE.
              </h2>
              <p className="mt-6 max-w-md font-mono text-[12px] leading-relaxed text-ink/65">
                USGS seismometers, NOAA hurricane trackers, GDACS disaster alerts, and GDELT news
                feeds converge into a single stream. Gemini AI classifies severity and extracts
                actionable intelligence — no false alarms, no wasted attention.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/platform"
                  className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-cream hover:bg-acid hover:text-ink transition-all duration-300 active:scale-[0.98]">
                  Explore Platform
                </Link>
                <Link to="/demo"
                  className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink/70 hover:border-ink/40 hover:text-ink transition-all duration-300 active:scale-[0.98]">
                  Live Demo
                </Link>
              </div>
            </motion.div>

            <motion.div {...useScrollReveal(0.15)} className="lg:col-span-7 relative">
              <div className="relative rounded-sm overflow-hidden border border-ink/10">
                <div className="aspect-[16/10] bg-gradient-to-br from-[#0d1117] to-[#1c2333] p-4 md:p-6">
                  <div className="h-full w-full rounded-sm border border-white/10 overflow-hidden relative">
                    {/* Mock map interface */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(ellipse at 30% 50%, #0f3460 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, #1a1040 0%, transparent 50%), radial-gradient(ellipse at 50% 70%, #0a1628 0%, transparent 60%)',
                    }} />
                    {/* Grid lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 400 300">
                      {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((x) => (
                        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" stroke="white" strokeWidth="0.5" />
                      ))}
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300].map((y) => (
                        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeWidth="0.5" />
                      ))}
                    </svg>
                    {/* Mock incident markers */}
                    {[
                      { x: '25%', y: '35%', r: '6', color: '#e94560' },
                      { x: '55%', y: '25%', r: '4', color: '#d97706' },
                      { x: '70%', y: '60%', r: '5', color: '#e94560' },
                      { x: '40%', y: '65%', r: '3', color: '#0f7ddb' },
                      { x: '15%', y: '55%', r: '4', color: '#d97706' },
                      { x: '85%', y: '40%', r: '3', color: '#0d9488' },
                    ].map((marker, i) => (
                      <motion.span key={i}
                        className="absolute rounded-full"
                        style={{
                          left: marker.x, top: marker.y,
                          width: `${parseInt(marker.r) * 2}px`,
                          height: `${parseInt(marker.r) * 2}px`,
                          background: marker.color,
                          boxShadow: `0 0 12px ${marker.color}60`,
                        }}
                        animate={reduced ? {} : { opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }} />
                    ))}
                    {/* Top bar mockup */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 backdrop-blur-sm border-b border-white/10 flex items-center px-3 gap-2">
                      <span className="h-2 w-2 rounded-full bg-crisis-red" />
                      <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/50">Sentinel · 6 active incidents</span>
                    </div>
                    {/* Bottom stats bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-7 bg-white/5 backdrop-blur-sm border-t border-white/10 flex items-center px-3 gap-3">
                      {['EQ 4.2', 'TC WARN', 'FLOOD', 'TSUNAMI'].map((tag, i) => (
                        <span key={i} className="font-mono text-[7px] px-1.5 py-0.5 rounded-full"
                          style={{ background: `${['#e94560', '#d97706', '#0f7ddb', '#0d9488'][i]}20`, color: ['#e94560', '#d97706', '#0f7ddb', '#0d9488'][i] }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 font-mono text-[8px] uppercase tracking-[0.14em] text-ink/40">
                  LIVE DASHBOARD PREVIEW
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="relative bg-cream border-y border-ink/8 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div {...useScrollReveal()} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <Counter to={24} suffix="/7" label="Seismic sensors" note="USGS monitoring" />
            <Counter to={99} suffix="%" label="Weather models" note="NOAA updates" />
            <Counter to={10} suffix=" min" label="Satellite refresh" note="Geo coverage" />
            <Counter to={100} suffix="k+" label="News sources" note="GDELT index" />
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative bg-cobalt py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <motion.h2 {...useScrollReveal(0.1)}
                className="font-display text-[clamp(42px,7vw,100px)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-cream">
                ACCESS THE<br />OPERATIONS<br />CONSOLE.
              </motion.h2>
              <motion.div {...useScrollReveal(0.2)} className="mt-8 flex flex-wrap gap-4">
                <Link to="/auth"
                  className="group inline-flex items-center gap-3 bg-acid px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-all duration-300 hover:bg-cream hover:text-ink active:scale-[0.98]">
                  Access Dashboard
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center gap-3 border border-cream/30 px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-cream/80 transition-all duration-300 hover:border-cream hover:text-cream active:scale-[0.98]">
                  Get Alerts
                </Link>
              </motion.div>
            </div>

            <motion.div {...useScrollReveal(0.25)} className="lg:col-span-5 relative">
              <div className="relative h-[260px] md:h-[320px]">
                <div className="h-full w-full rounded-sm flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 spectral-gradient opacity-80" />
                  <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 128 128\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.7\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
                    backgroundSize: '128px 128px',
                  }} />
                  <GrainyRender className="absolute inset-0 h-full w-full" />
                  <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 200 200" preserveAspectRatio="none">
                    {[30, 65, 100, 135, 170].map((r, i) => (
                      <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="white" strokeWidth="0.8" strokeDasharray={`${3 + i * 2} ${4 + i}`} />
                    ))}
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-16 relative z-10 border-t border-cream/10 pt-6">
          <MarqueeTicker phrases={marqueePhrases} />
        </div>
      </section>

      <Footer />
    </div>
  )
}

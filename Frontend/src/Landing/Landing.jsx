import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useReducedMotion, useInView } from 'framer-motion'
import Nav from './Nav'
import { api } from '../lib/api'

const easePremium = [0.32, 0.72, 0, 1]
const easeLusion = [0.4, 0, 0.1, 1]

/* ── Acid 4-point star ── */
function AcidStar({ size = 'sm' }) {
  const reduced = useReducedMotion()
  const cls = size === 'lg' ? 'acid-star acid-star-lg' : 'acid-star'
  return (
    <motion.span
      className={cls}
      aria-hidden="true"
      animate={reduced ? {} : { rotate: [0, 90, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/* ── Plus/dot logomark (⊹) ── */
function PlusLogomark() {
  return (
    <span className="plus-logomark" aria-hidden="true">
      <span /><span /><span /><span />
    </span>
  )
}

/* ── Marquee ticker ── */
function MarqueeTicker({ phrases }) {
  const text = phrases.join('  \u2022  ')
  const doubled = `${text}  \u2022  ${text}`
  return (
    <div className="marquee-wrap py-2">
      <div className="marquee-track">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/70 whitespace-nowrap select-none px-2">
          {doubled}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/70 whitespace-nowrap select-none px-2" aria-hidden="true">
          {doubled}
        </span>
      </div>
    </div>
  )
}

/* ── Callout annotation line ── */
function CalloutLine({ caption, style }) {
  return (
    <div className="callout-line" style={style}>
      <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
        <circle cx="4" cy="4" r="2" fill="var(--color-acid)" />
        <path d="M4 4L80 4L80 40" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="1" />
      </svg>
      <span
        className="absolute font-mono text-[9px] uppercase tracking-[0.14em] text-ink/60 whitespace-nowrap"
        style={{ bottom: 4, left: 84 }}
      >
        {caption}
      </span>
    </div>
  )
}

/* ── Specimen tile ── */
function SpecimenTile({ children, caption }) {
  return (
    <div className="group">
      <div className="specimen-tile flex items-center justify-center bg-cream/10">
        {children}
      </div>
      <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/60">
        {caption}
      </span>
    </div>
  )
}

/* ── Iridescent glass render ── */
function IridescentRender({ className = '' }) {
  const reduced = useReducedMotion()
  return (
    <div className={`iridescent-render rounded-sm ${className}`} aria-hidden="true">
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="opacity-80">
          <path
            d="M40 4L76 20V60L40 76L4 60V20L40 4Z"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.6"
            fill="white"
            fillOpacity="0.08"
          />
          <path
            d="M40 14L66 27V53L40 66L14 53V27L40 14Z"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.4"
            fill="none"
          />
          <circle cx="40" cy="40" r="8" stroke="white" strokeWidth="1" strokeOpacity="0.3" fill="none" />
        </svg>
      </div>
    </div>
  )
}

/* ── Grainy pointillist render ── */
function GrainyRender({ className = '' }) {
  return (
    <div className={`grainy-render ${className}`} aria-hidden="true">
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          {Array.from({ length: 40 }).map((_, i) => {
            const cx = 15 + Math.random() * 90
            const cy = 15 + Math.random() * 90
            const r = 1.5 + Math.random() * 4
            const opacity = 0.15 + Math.random() * 0.35
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="var(--color-coral)"
                opacity={opacity}
              />
            )
          })}
          {Array.from({ length: 20 }).map((_, i) => {
            const x1 = 10 + Math.random() * 100
            const y1 = 10 + Math.random() * 100
            const x2 = x1 + (Math.random() - 0.5) * 40
            const y2 = y1 + (Math.random() - 0.5) * 40
            return (
              <line
                key={`l${i}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="var(--color-coral)"
                strokeOpacity="0.12"
                strokeWidth="0.5"
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

/* ── Spectrogram waveform ── */
function SeismicWaveform() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-70">
      <path
        d="M0 32L4 32L6 20L8 44L10 28L12 38L14 32L16 32L18 24L20 40L22 30L24 36L26 32L28 32L30 26L32 38L34 29L36 35L38 32L40 32L42 28L44 36L46 31L48 34L50 32L52 32L54 22L56 42L58 27L60 37L62 32L64 32"
        stroke="var(--color-cream)"
        strokeWidth="1.5"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ── AI node diagram ── */
function AINodeDiagram() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-70">
      <circle cx="32" cy="18" r="5" stroke="var(--color-cream)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
      <circle cx="16" cy="46" r="4" stroke="var(--color-cream)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
      <circle cx="48" cy="46" r="4" stroke="var(--color-cream)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
      <circle cx="32" cy="32" r="3" stroke="var(--color-acid)" strokeWidth="1" strokeOpacity="0.5" fill="none" />
      <line x1="32" y1="23" x2="32" y2="29" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="32" y1="35" x2="20" y2="43" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="32" y1="35" x2="44" y2="43" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="20" y1="20" x2="44" y2="20" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.2" />
    </svg>
  )
}

/* ── Radar / satellite tile ── */
function RadarTile() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-70">
      <circle cx="32" cy="32" r="28" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
      <circle cx="32" cy="32" r="20" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
      <circle cx="32" cy="32" r="12" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
      <circle cx="32" cy="32" r="4" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
      <line x1="32" y1="32" x2="32" y2="4" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="32" y1="32" x2="60" y2="32" stroke="var(--color-cream)" strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M32 32L52 20" stroke="var(--color-acid)" strokeWidth="1" strokeOpacity="0.6" />
      <path d="M32 32L32 12L48 18" stroke="var(--color-acid)" strokeWidth="0.5" strokeOpacity="0.2" fill="var(--color-acid)" fillOpacity="0.08" />
    </svg>
  )
}

/* ── Alert notification tile ── */
function AlertTile() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-70">
      <rect x="10" y="14" width="44" height="36" rx="4" stroke="var(--color-cream)" strokeWidth="1" strokeOpacity="0.5" fill="none" />
      <line x1="20" y1="26" x2="44" y2="26" stroke="var(--color-cream)" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="20" y1="34" x2="38" y2="34" stroke="var(--color-cream)" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="20" y1="42" x2="30" y2="42" stroke="var(--color-cream)" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="50" cy="18" r="6" fill="var(--color-acid)" fillOpacity="0.25" stroke="var(--color-acid)" strokeWidth="1" />
      <text x="50" y="21" textAnchor="middle" fontSize="7" fill="var(--color-cream)" fontFamily="monospace">3</text>
    </svg>
  )
}

/* ── Scroll-reveal hook ── */
function useScrollReveal(delay = 0) {
  const reduced = useReducedMotion()
  if (reduced) return {}
  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.9, delay, ease: easePremium },
  }
}

/* ── Split text word animation ── */
function SplitText({ text, className }) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  if (reduced) return <span className={className}>{text}</span>
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="split-word">
          <motion.span
            className="split-word-inner"
            initial={{ y: '100%', rotate: 3 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.04, ease: easeLusion }}
          >
            {word}{i < words.length - 1 && '\u00A0'}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ── Animated counter ── */
function AnimatedCount({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    if (!inView || reduced) { setDisplay(value); return }
    const start = prev.current
    const diff = value - start
    const duration = 800
    const startTime = performance.now()
    let raf
    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + diff * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    prev.current = value
    return () => cancelAnimationFrame(raf)
  }, [value, inView, reduced])

  return <span ref={ref} className="font-mono font-bold tabular-nums text-ink">{display.toLocaleString()}{suffix}</span>
}

/* ── Hero counter tile ── */
function Counter({ to, suffix = '', label, note }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [count, setCount] = useState(to)
  const rafRef = useRef()
  const startedRef = useRef(false)

  useEffect(() => {
    if (!inView || reduced || startedRef.current) return
    startedRef.current = true
    let current = 0
    const duration = 1500
    const step = Math.ceil(to / (duration / 16))
    const tick = () => {
      current += step
      if (current >= to) { setCount(to); return }
      setCount(current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, reduced, to])

  return (
    <div ref={ref}>
      <span className="font-display text-2xl font-extrabold tabular-nums text-ink">{count}{suffix}</span>
      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">{label}</span>
      <span className="mt-0.5 block font-mono text-[9px] text-ink/40">{note}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════ */

export default function Landing() {
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

  const marqueePhrases = [
    'SEISMIC MONITORING',
    'SATELLITE IMAGERY',
    'HURRICANE TRACKING',
    'AI CLASSIFICATION',
    'REAL-TIME ALERTS',
    'MULTI-SOURCE FUSION',
    'GLOBAL COVERAGE',
    'CRITICAL EVENT DETECTION',
    'DISASTER RESPONSE',
  ]

  const activeCount = liveStats?.active ?? liveStats?.total ?? 0

  return (
    <div className="landing relative min-h-screen bg-cream text-ink overflow-x-hidden">

      {/* ── Scroll progress ── */}
      <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-label="Page scroll progress">
        <div className="scroll-progress-track" />
        <div className="scroll-progress-bar" style={{
          '--progress': progress,
          background: 'var(--color-acid)',
        }} />
      </div>

      <Nav />

      {/* ═══════════════════════════════════════════════
         SECTION 1: HERO — Full-bleed dark bg + bleeding headline + ticker
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden">

        {/* Background: layered seismic-monitoring composition */}
        <div className="absolute inset-0" aria-hidden="true">
          {/* Deep field gradient */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 40%, #1E3A2A 0%, #0f1a14 50%, #0a0f0c 100%)' }} />
          {/* Radar sweep arcs — satellite coverage */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1200 900" preserveAspectRatio="none">
            {[80, 160, 240, 320, 400, 500, 620].map((r, i) => (
              <circle key={i} cx="720" cy="360" r={r} fill="none" stroke="white" strokeWidth="0.8" strokeDasharray={`${2 + i} ${4 + i * 2}`} />
            ))}
            {[0, 30, 60, 90, 120, 150].map((angle, i) => (
              <line key={`rad${i}`} x1="720" y1="360" x2={720 + Math.cos(angle * Math.PI / 180) * 620} y2={360 + Math.sin(angle * Math.PI / 180) * 620} stroke="white" strokeWidth="0.5" opacity="0.4" />
            ))}
          </svg>
          {/* Seismic waveform base pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1200 900" preserveAspectRatio="none">
            {[100, 200, 350, 500, 650, 780].map((y, i) => (
              <path
                key={i}
                d={`M0 ${y} C ${150 + i * 60} ${y - 30 - i * 5}, ${300 + i * 40} ${y + 40 + i * 8}, 450 ${y} C ${600 - i * 30} ${y - 20}, ${750} ${y + 25}, 900 ${y} C ${1000} ${y - 15}, ${1100} ${y + 10}, 1200 ${y}`}
                fill="none"
                stroke="white"
                strokeWidth="0.8"
              />
            ))}
          </svg>
          {/* Grain texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px',
            }}
          />
          {/* Topo-like contour ellipses */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 1200 800" preserveAspectRatio="none">
            {[200, 280, 360, 440, 520, 600, 680].map((cy, i) => (
              <ellipse
                key={i}
                cx={600 + Math.sin(i * 1.3) * 200}
                cy={cy + Math.cos(i * 0.8) * 40}
                rx={300 + i * 60}
                ry={30 + i * 4}
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </svg>
          {/* Glowing accent nodes — active monitoring sites */}
          {[
            { x: 18, y: 28 }, { x: 48, y: 22 }, { x: 72, y: 35 },
            { x: 32, y: 58 }, { x: 62, y: 62 }, { x: 85, y: 55 },
          ].map((pos, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-acid/50"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              animate={reduced ? {} : { opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Mono eyebrow — top left edge */}
        <div className="relative z-10 pt-28 px-6 md:px-10">
          <motion.div
            {...useScrollReveal()}
            className="flex items-center gap-3"
          >
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

        {/* Marquee ticker — across the middle */}
        <div className="relative z-10">
          <MarqueeTicker phrases={marqueePhrases} />
        </div>

        {/* Mono sub-headlines — cropped at edges */}
        <div className="relative z-10 flex justify-between items-end px-6 md:px-10">
          <motion.span
            {...useScrollReveal(0.1)}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-sage/50 max-w-[120px] leading-relaxed"
          >
            Global monitoring across 6 authoritative sources
          </motion.span>
          <motion.span
            {...useScrollReveal(0.2)}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-sage/50 max-w-[140px] leading-relaxed text-right"
          >
            AI-powered severity classification in real time
          </motion.span>
        </div>

        {/* Giant bleeding headline — bottom */}
        <div className="relative z-10 bleed-section pb-8 md:pb-12">
          <motion.h1
            initial={reduced ? {} : { opacity: 0, y: 60 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: easePremium }}
            className="bleed-headline text-cream text-[clamp(52px,9vw,180px)] px-2"
          >
            SEE WHAT MATTERS BEFORE ANYONE ELSE
          </motion.h1>
        </div>

        {/* Bottom edge: callout line */}
        <div className="relative z-10 pb-6 px-6 md:px-10">
          <motion.div {...useScrollReveal(0.3)} className="flex items-center gap-4">
            <button
              onClick={() => document.getElementById('section-statement')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })}
              className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sage/60 hover:text-acid transition-colors duration-300"
            >
              <span>Explore</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-y-0.5">
                <path d="M8 3L8 13M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="hairline flex-1 text-sage/20" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         SECTION 2: STATEMENT — Display headline + iridescent render on mist
         ═══════════════════════════════════════════════ */}
      <section id="section-statement" className="relative bg-mist py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left: oversized stacked display headline */}
            <motion.div {...useScrollReveal()} className="lg:col-span-6 lg:col-start-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-moss/70">
                The platform
              </span>
              <h2 className="mt-4 font-display text-[clamp(40px,6vw,88px)] font-extrabold uppercase leading-[0.94] tracking-[-0.015em] text-ink">
                BETTER<br />RESOURCE<br />DECISIONS,<br />FASTER.
              </h2>
              <p className="mt-6 max-w-md font-mono text-[12px] leading-relaxed text-ink/60">
                When an earthquake strikes or a hurricane makes landfall, critical information is fragmented
                across agencies. Sentinel unifies every signal into one operational picture — so you act
                with confidence, not guesswork.
              </p>
            </motion.div>

            {/* Right: iridescent crystal render + callout */}
            <motion.div {...useScrollReveal(0.15)} className="lg:col-span-6 relative">
              <div className="relative h-[340px] md:h-[420px] overflow-hidden rounded-sm">
                {/* Iridescent CSS render */}
                <IridescentRender className="absolute inset-0 h-full w-full" />
                {/* Glass crystal lattice diagram overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="opacity-50">
                    <path d="M80 8L144 44V116L80 152L16 116V44L80 8Z" stroke="white" strokeWidth="0.8" strokeOpacity="0.5" fill="white" fillOpacity="0.04" />
                    <path d="M80 24L128 52V100L80 128L32 100V52L80 24Z" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                    <path d="M80 40L112 58V90L80 108L48 90V58L80 40Z" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" fill="none" />
                    <circle cx="80" cy="74" r="6" stroke="var(--color-acid)" strokeWidth="1" fill="none" opacity="0.7" />
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180
                      const x = 80 + Math.cos(rad) * 22
                      const y = 74 + Math.sin(rad) * 22
                      return <circle key={i} cx={x} cy={y} r="2" fill="white" opacity="0.3" />
                    })}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180
                      const x = 80 + Math.cos(rad) * 22
                      const y = 74 + Math.sin(rad) * 22
                      return <line key={`l${i}`} x1="80" y1="74" x2={x} y2={y} stroke="white" strokeWidth="0.4" opacity="0.2" />
                    })}
                  </svg>
                </div>
                <CalloutLine
                  caption="ACCURACY THROUGH REAL-TIME DATA FUSION"
                  style={{ bottom: -20, right: 40 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         SECTION 3: CAPABILITY — Statement on lavender + grainy render
         ═══════════════════════════════════════════════ */}
      <section className="relative bg-lavender py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left: grainy render with seismic grid overlay */}
            <motion.div {...useScrollReveal()} className="lg:col-span-6 relative order-2 lg:order-1">
              <div className="relative h-[300px] md:h-[380px]">
                <div className="h-full w-full rounded-sm flex items-center justify-center overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #C2BCCB 0%, #d4d0dd 40%, #b8b1c2 100%)' }}>
                  {/* Tiny dot-grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, var(--color-coral) 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />
                  {/* Grainy pointillist particles */}
                  <GrainyRender className="absolute inset-0 h-full w-full" />
                  {/* Specimen measurement grid */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 400 400" preserveAspectRatio="none">
                    {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((y, i) => (
                      <line key={`h${i}`} x1="0" y1={y} x2="400" y2={y} stroke="var(--color-coral)" strokeWidth="0.5" />
                    ))}
                    {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((x, i) => (
                      <line key={`v${i}`} x1={x} y1="0" x2={x} y2="400" stroke="var(--color-coral)" strokeWidth="0.5" />
                    ))}
                  </svg>
                  {/* Crosshair center */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.15]" viewBox="0 0 400 400">
                    <circle cx="200" cy="200" r="60" fill="none" stroke="var(--color-coral)" strokeWidth="1" />
                    <circle cx="200" cy="200" r="30" fill="none" stroke="var(--color-coral)" strokeWidth="0.5" />
                    <line x1="140" y1="200" x2="260" y2="200" stroke="var(--color-coral)" strokeWidth="0.5" />
                    <line x1="200" y1="140" x2="200" y2="260" stroke="var(--color-coral)" strokeWidth="0.5" />
                  </svg>
                </div>
                <CalloutLine
                  caption="CORAL PARTICLE SIMULATION — SEISMIC DATA VISUALIZATION"
                  style={{ top: 20, right: -10 }}
                />
              </div>
            </motion.div>

            {/* Right: display headline */}
            <motion.div {...useScrollReveal(0.15)} className="lg:col-span-6 order-1 lg:order-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cobalt/70">
                Capability
              </span>
              <h2 className="mt-4 font-display text-[clamp(38px,5.5vw,80px)] font-extrabold uppercase leading-[0.94] tracking-[-0.015em] text-ink">
                ONE PIPELINE.<br />ONE PICTURE.<br /><span className="text-acid">ZERO NOISE.</span>
              </h2>
              <p className="mt-6 max-w-md font-mono text-[12px] leading-relaxed text-ink/60">
                USGS seismometers, NOAA hurricane trackers, GDACS disaster alerts, and GDELT news
                feeds converge into a single stream. Gemini AI classifies severity and extracts
                actionable intelligence — no false alarms, no wasted attention.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         SECTION 4: SERVICES — Emerald slab + specimen grid
         ═══════════════════════════════════════════════ */}
      <section id="section-services" className="relative bg-emerald py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {/* Specimen tile grid — across the top */}
          <motion.div {...useScrollReveal()} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            <SpecimenTile caption="SEISMIC WAVEFORM ANALYSIS">
              <SeismicWaveform />
            </SpecimenTile>
            <SpecimenTile caption="SATELLITE + RADAR TRACKING">
              <RadarTile />
            </SpecimenTile>
            <SpecimenTile caption="AI SEVERITY CLASSIFICATION">
              <AINodeDiagram />
            </SpecimenTile>
            <SpecimenTile caption="REAL-TIME ALERT DISPATCH">
              <AlertTile />
            </SpecimenTile>
          </motion.div>

          {/* Hairline divider */}
          <div className="hairline bg-cream/15 mb-14" />

          {/* Enormous stacked headline — anchored bottom-left */}
          <motion.div {...useScrollReveal(0.1)}>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">
              Services
            </span>
            <h2 className="mt-4 font-display text-[clamp(40px,7vw,100px)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-cream">
              CORE<br />MONITORING<br />SERVICES.
            </h2>
            <p className="mt-8 max-w-lg font-mono text-[12px] leading-relaxed text-cream/70">
              From seismic detection to alert dispatch, every layer of the pipeline is built
              for responders who need to assess a crisis in seconds, not minutes. Emergency
              operations centers, field teams, and humanitarian agencies worldwide trust Sentinel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         INTERLUDE: Stats bar
         ═══════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════
         VISUAL SPECIMENS — Full-bleed photo strip
         ═══════════════════════════════════════════════ */}
      <section className="relative bg-cream py-16 md:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div {...useScrollReveal()} className="mb-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
              Visual specimens
            </span>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[
              {
                
                caption: 'Geological cross-section — USGS field sample',
              },
              {
                src: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=500&q=80&fit=crop&auto=format',
                caption: 'Cyclone formation — NOAA satellite capture',
              },
              {
                src: 'https://images.unsplash.com/photo-1623032376831-f11e4ac41f03?w=500&q=80&fit=crop&auto=format',
                caption: 'Seismic fracture pattern — core sample analysis',
              },
              {
                src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80&fit=crop&auto=format',
                caption: 'Iridescent crystal lattice — AI data topology',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...useScrollReveal(0.08 * i)}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden border border-ink/10 transition-all duration-500 group-hover:border-acid/60">
                  <div
                    className="absolute inset-0 bg-cover bg-center saturate-[0.6] transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.src})` }}
                  />
                  {/* Grain overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 128 128\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
                      backgroundSize: '128px 128px',
                    }}
                  />
                  {/* Specimen annotation dot */}
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-acid opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {/* Bottom annotation line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-ink/10 transition-colors duration-300 group-hover:bg-acid/40" />
                </div>
                <span className="mt-2.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-ink/45 leading-relaxed transition-colors duration-300 group-hover:text-ink/60">
                  {item.caption}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         SECTION 5: CTA — Cobalt slab + bleeding headline + coral render
         ═══════════════════════════════════════════════ */}
      <section id="section-cta" className="relative bg-cobalt py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">

            {/* Left: bleeding headline */}
            <div className="lg:col-span-7">
              <motion.div {...useScrollReveal()}>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">
                  Get started
                </span>
              </motion.div>
              <motion.h2
                {...useScrollReveal(0.1)}
                className="mt-4 font-display text-[clamp(42px,7vw,100px)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-cream"
              >
                GET IN<br />TOUCH<br />WITH US.
              </motion.h2>
              <motion.div {...useScrollReveal(0.2)} className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/auth"
                  className="group inline-flex items-center gap-3 bg-acid px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-all duration-300 hover:bg-cream hover:text-ink active:scale-[0.98]"
                >
                  Access Dashboard
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="/subscribe"
                  className="inline-flex items-center gap-3 border border-cream/30 px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-cream/80 transition-all duration-300 hover:border-cream hover:text-cream active:scale-[0.98]"
                >
                  Get Alerts
                </a>
              </motion.div>
            </div>

            {/* Right: coral grainy render on thermal imagery */}
            <motion.div {...useScrollReveal(0.25)} className="lg:col-span-5 relative">
              <div className="relative h-[260px] md:h-[320px]">
                <div className="h-full w-full rounded-sm flex items-center justify-center overflow-hidden relative">
                  {/* Spectral/thermal gradient background */}
                  <div className="absolute inset-0 spectral-gradient opacity-80" />
                  {/* Grain texture */}
                  <div
                    className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 128 128\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.7\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
                      backgroundSize: '128px 128px',
                    }}
                  />
                  {/* Coral grainy particles */}
                  <GrainyRender className="absolute inset-0 h-full w-full" />
                  {/* Thermal contour lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 200 200" preserveAspectRatio="none">
                    {[30, 65, 100, 135, 170].map((r, i) => (
                      <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="white" strokeWidth="0.8" strokeDasharray={`${3 + i * 2} ${4 + i}`} />
                    ))}
                  </svg>
                </div>
                <CalloutLine
                  caption="WARM CORAL — RESPONSE PRIORITIZATION SIGNAL"
                  style={{ top: -16, left: 16 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom ticker repeat */}
        <div className="mt-16 relative z-10 border-t border-cream/10 pt-6">
          <MarqueeTicker phrases={marqueePhrases} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
         SECTION 6: FOOTER — Minimal mono row
         ═══════════════════════════════════════════════ */}
      <footer className="relative bg-cream border-t border-ink/8 py-10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <PlusLogomark />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink/70">Sentinel</span>
              <AcidStar size="sm" />
            </div>

            <div className="flex items-center gap-2">
              <a href="/auth" className="acid-link font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60 no-underline">Dashboard</a>
              <span className="font-mono text-[10px] text-ink/25">/</span>
              <a href="/subscribe" className="acid-link font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60 no-underline">Alerts</a>
              <span className="font-mono text-[10px] text-ink/25">/</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">&copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

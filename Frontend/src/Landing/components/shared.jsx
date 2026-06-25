import { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'

export const easePremium = [0.32, 0.72, 0, 1]
export const easeLusion = [0.4, 0, 0.1, 1]

export function AcidStar({ size = 'sm' }) {
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

export function PlusLogomark() {
  return (
    <img src="/Sentinel.png" alt="Sentinel" className="h-10 w-auto" />
  )
}

export function MarqueeTicker({ phrases }) {
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

export function CalloutLine({ caption, style }) {
  return (
    <div className="callout-line" style={style}>
      <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
        <circle cx="4" cy="4" r="2" fill="var(--color-acid)" />
        <path d="M4 4L80 4L80 40" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="1" />
      </svg>
      <span
        className="absolute font-mono text-[9px] uppercase tracking-[0.14em] text-ink/65 whitespace-nowrap"
        style={{ bottom: 4, left: 84 }}
      >
        {caption}
      </span>
    </div>
  )
}

export function SpecimenTile({ children, caption }) {
  return (
    <div className="group">
      <div className="specimen-tile bg-cream/10 overflow-hidden">
        {children}
      </div>
      <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/60">
        {caption}
      </span>
    </div>
  )
}

export function IridescentRender({ className = '' }) {
  const reduced = useReducedMotion()
  return (
    <div className={`iridescent-render rounded-sm ${className}`} aria-hidden="true">
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="opacity-80">
          <path d="M40 4L76 20V60L40 76L4 60V20L40 4Z"
            stroke="white" strokeWidth="1" strokeOpacity="0.6"
            fill="white" fillOpacity="0.08" />
          <path d="M40 14L66 27V53L40 66L14 53V27L40 14Z"
            stroke="white" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
          <circle cx="40" cy="40" r="8" stroke="white" strokeWidth="1" strokeOpacity="0.3" fill="none" />
        </svg>
      </div>
    </div>
  )
}

export function GrainyRender({ className = '' }) {
  return (
    <div className={`grainy-render ${className}`} aria-hidden="true">
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          {Array.from({ length: 40 }).map((_, i) => (
            <circle key={i}
              cx={15 + Math.random() * 90} cy={15 + Math.random() * 90}
              r={1.5 + Math.random() * 4}
              fill="var(--color-coral)" opacity={0.15 + Math.random() * 0.35} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`l${i}`}
              x1={10 + Math.random() * 100} y1={10 + Math.random() * 100}
              x2={10 + Math.random() * 100 + (Math.random() - 0.5) * 40}
              y2={10 + Math.random() * 100 + (Math.random() - 0.5) * 40}
              stroke="var(--color-coral)" strokeOpacity="0.12" strokeWidth="0.5" />
          ))}
        </svg>
      </div>
    </div>
  )
}

export function SeismicWaveform() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-70">
      <path d="M0 32L4 32L6 20L8 44L10 28L12 38L14 32L16 32L18 24L20 40L22 30L24 36L26 32L28 32L30 26L32 38L34 29L36 35L38 32L40 32L42 28L44 36L46 31L48 34L50 32L52 32L54 22L56 42L58 27L60 37L62 32L64 32"
        stroke="var(--color-cream)" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
    </svg>
  )
}

export function RadarTile() {
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

export function AINodeDiagram() {
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

export function AlertTile() {
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

export function useScrollReveal(delay = 0) {
  const reduced = useReducedMotion()
  if (reduced) return {}
  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.9, delay, ease: easePremium },
  }
}

export function SplitText({ text, className }) {
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

export function Counter({ to, suffix = '', label, note }) {
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
      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-ink/65">{label}</span>
      <span className="mt-0.5 block font-mono text-[9px] text-ink/55">{note}</span>
    </div>
  )
}

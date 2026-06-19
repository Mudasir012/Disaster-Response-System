import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion'
import Nav from './Nav'
import Features from './Features'
import DataSources from './DataSources'
import CTAFooter from './CTAFooter'

const HeroScene = lazy(() => import('./HeroScene'))

const easePremium = [0.32, 0.72, 0, 1]
const easeLusion = [0.4, 0, 0.1, 1]

function useScrollReveal(delay = 0) {
  const reduced = useReducedMotion()
  return reduced ? {} : {
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.8, delay, ease: easePremium },
  }
}

function AnimatedCounter({ from = 0, to, suffix = '', label, note }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [count, setCount] = useState(() => (inView && !reduced ? from : to))
  const rafRef = useRef()
  const startedRef = useRef(false)

  useEffect(() => {
    if (!inView || reduced || startedRef.current) return
    startedRef.current = true
    let current = from
    const duration = 1500
    const step = Math.ceil((to - from) / (duration / 16))

    const tick = () => {
      current += step
      if (current >= to) {
        setCount(to)
        return
      }
      setCount(current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, reduced, from, to])

  return (
    <div ref={ref} className="bg-white/[0.03] rounded-xl px-5 py-6 ring-1 ring-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.1,1)] hover:bg-white/[0.05] cursor-pointer">
      <span className="font-sora text-lg font-bold text-glacier-white tabular-nums">
        {count}{suffix}
      </span>
      <span className="block mt-1 text-xs text-cool-gray/70">{label}</span>
      <span className="block mt-0.5 text-[10px] font-mono text-cool-gray/50">{note}</span>
    </div>
  )
}

function SplitText({ text, className }) {
  const reduced = useReducedMotion()
  const words = text.split(' ')

  if (reduced) {
    return <span className={className}>{text}</span>
  }

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
            {word}
            {i < words.length - 1 && '\u00A0'}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

const testimonials = [
  {
    quote: 'We cut our response time by 60% in the first month. The single-pane view of seismic, weather, and news data is a game changer.',
    name: 'Maria Santos',
    role: 'Operations Director, Pacific DRR Center',
  },
  {
    quote: 'When Cyclone Mocha hit, we had damage assessments mapped before ground teams even radioed in. This is the future of crisis response.',
    name: 'James Chelimo',
    role: 'Emergency Coordinator, UNDAC',
  },
  {
    quote: 'The AI severity classification filters out noise we used to waste hours on. Finally, a tool that respects the responder\'s time.',
    name: 'Dr. Aisha Patel',
    role: 'Chief Resilience Officer, City of Mumbai',
  },
]

function SectionCrosses() {
  return (
    <>
      <div className="absolute top-8 left-8 text-cool-gray/20">
        <span className="cross" />
      </div>
      <div className="absolute top-8 right-8 text-cool-gray/20">
        <span className="cross" />
      </div>
      <div className="absolute bottom-8 left-8 text-cool-gray/20">
        <span className="cross" />
      </div>
      <div className="absolute bottom-8 right-8 text-cool-gray/20">
        <span className="cross" />
      </div>
    </>
  )
}

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const scrollRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  const globeOpacity = useTransform(scrollYProgress, [0, 0.12, 0.2, 0.85, 0.95], [1, 0.3, 0.15, 0.15, 0])

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      scrollRef.current = v
      setProgress(v)
    })
  }, [scrollYProgress])

  useEffect(() => {
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const fadeIn = (delay = 0, y = 16, duration = 0.7) => reduced ? {} : {
    initial: { opacity: 0, y, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration, delay, ease: easePremium },
  }

  return (
    <div className="relative min-h-[100dvh] bg-[#05080f]">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-label="Page scroll progress">
        <div className="scroll-progress-track" />
        <div className="scroll-progress-bar" style={{ '--progress': progress }} />
      </div>

      <motion.div style={{ opacity: reduced ? 1 : globeOpacity }}>
        <Suspense fallback={<div className="fixed inset-0 bg-[#05080f]" />}>
          <HeroScene scrollRef={scrollRef} mouseRef={mouseRef} />
        </Suspense>
      </motion.div>

      <div className="relative z-10">
        <Nav />

        {/* ── Chapter 1: Hero ── */}
        <section className="relative min-h-[100dvh] flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 pt-24">
            <div className="max-w-3xl">
              <motion.span {...fadeIn(0.2)}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-cool-gray"
              >
                <span className="cross mr-1" style={{ width: '0.625rem', height: '0.625rem' }} />
                Real-Time Disaster Intelligence
              </motion.span>

              <motion.h1 {...fadeIn(0.35, 24, 0.8)}
                className="mt-6 font-sora text-6xl font-extrabold leading-[1.05] tracking-tight text-glacier-white md:text-8xl"
              >
                See what matters.
                <br />
                <span className="text-crisis-red">Before anyone else.</span>
              </motion.h1>

              <motion.p {...fadeIn(0.5)}
                className="mt-6 max-w-xl text-base leading-relaxed text-cool-gray md:text-lg"
              >
                Real-time global disaster monitoring powered by AI.
                Aggregating live data from USGS, NOAA, GDACS, and global news
                sources.
              </motion.p>

              <motion.div {...fadeIn(0.65)}
                className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
              >
                <a
                  href="/auth"
                  className="group rounded-full bg-crisis-red px-8 py-4 font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.35,0,0,1)] hover:bg-white hover:text-crisis-red active:scale-[0.97] flex items-center gap-3"
                >
                  Access Dashboard
                  <span className="w-8 h-8 rounded-full bg-white/[0.12] flex items-center justify-center transition-all duration-500 group-hover:bg-crisis-red/10 group-hover:translate-x-0.5">
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Chapter 2: The Problem (Dark) ── */}
        <section className="section-deferred relative py-40 md:py-56">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...useScrollReveal()} className="max-w-3xl">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-crisis-red/70">
                The challenge
              </span>
              <h2 className="mt-4 font-sora text-4xl font-bold leading-tight text-glacier-white md:text-5xl">
                <SplitText text="Every second matters. But the data is scattered." />
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-cool-gray/80 md:text-lg">
                When a earthquake strikes or a hurricane makes landfall, critical
                information is fragmented across government agencies, news feeds,
                satellite systems, and humanitarian reports. Responders waste
                precious minutes hunting for signal in the noise.
              </p>
            </motion.div>

            <motion.div {...useScrollReveal(0.2)}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatedCounter to={24} suffix="/7" label="Seismic sensors" note="USGS monitoring" delay={0.3} />
              <AnimatedCounter to={99} suffix="%" label="Weather models" note="NOAA updates" delay={0.38} />
              <AnimatedCounter to={10} suffix=" min" label="Satellite refresh" note="Geo coverage" delay={0.46} />
              <AnimatedCounter to={100} suffix="k+" label="News sources" note="GDELT index" delay={0.54} />
            </motion.div>
          </div>
        </section>

        {/* ── Chapter 3: The Pipeline (Alt background) ── */}
        <section className="section-deferred section-alt relative py-32 md:py-40">
          <SectionCrosses />
          <div className="grid-overlay" />

          <div className="mx-auto max-w-7xl px-6 relative">
            <motion.div {...useScrollReveal()} className="max-w-3xl">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-signal-blue/70">
                The pipeline
              </span>
              <h2 className="mt-4 font-sora text-4xl font-bold leading-tight text-glacier-white md:text-5xl">
                <SplitText text="One pipeline. One picture." />
              </h2>
            </motion.div>

            <div className="mt-16">
              <Features />
            </div>
          </div>
        </section>

        {/* ── Chapter 4: The Sources ── */}
        <section id="sources" className="section-deferred relative py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...useScrollReveal()} className="mb-16 max-w-3xl">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-cool-gray/50">
                Our network
              </span>
              <h2 className="mt-4 font-sora text-3xl font-bold text-glacier-white md:text-4xl">
                <SplitText text="Authoritative data, one pipeline." />
              </h2>
            </motion.div>
            <DataSources />
          </div>
        </section>

        {/* ── Chapter 5: For Responders (Alt background) ── */}
        <section id="features" className="section-deferred section-alt relative py-32 md:py-40">
          <SectionCrosses />
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...useScrollReveal()} className="max-w-3xl">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-amber/70">
                Built for
              </span>
              <h2 className="mt-4 font-sora text-4xl font-bold leading-tight text-glacier-white md:text-5xl">
                <SplitText text="The people who act first." />
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-cool-gray/80 md:text-lg">
                Emergency operations centers, field response teams, humanitarian
                organizations, and government agencies. Anyone who needs to assess
                a crisis in seconds, not minutes.
              </p>
            </motion.div>

            <motion.div {...useScrollReveal(0.15)}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  role: 'Command Centers',
                  context: 'Large monitors, low light, high stakes',
                  need: 'See regional incidents at a glance. Filter noise. Dispatch with confidence.',
                },
                {
                  role: 'Field Responders',
                  context: 'Tablets, outdoor glare, limited attention',
                  need: 'Get alerts for your zone. Assess severity. Share intel with command.',
                },
                {
                  role: 'Humanitarian Agencies',
                  context: 'Global operations, multiple crises',
                  need: 'Track all active disasters. Coordinate relief. Monitor unfolding situations.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: easePremium }}
                  className="bg-white/[0.03] rounded-xl p-6 md:p-8 ring-1 ring-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.1,1)] hover:bg-white/[0.06] hover:ring-white/[0.12] cursor-pointer group"
                >
                  <span className="font-sora text-lg font-bold text-glacier-white group-hover:text-white transition-colors">{item.role}</span>
                  <span className="block mt-1 text-xs font-mono text-cool-gray/50 group-hover:text-cool-gray/70 transition-colors">{item.context}</span>
                  <div className="mt-4 w-8 h-[2px] bg-crisis-red/50 transition-all duration-500 group-hover:w-12 group-hover:bg-crisis-red" />
                  <p className="mt-4 text-sm leading-relaxed text-cool-gray/80 group-hover:text-cool-gray/90 transition-colors">{item.need}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Chapter 6: Testimonials ── */}
        <section className="section-deferred relative py-32 md:py-40 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 0%, #e94560, transparent 50%)',
            }}
          />
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...useScrollReveal()} className="max-w-3xl">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-cool-gray/50">
                Trusted by
              </span>
              <h2 className="mt-4 font-sora text-3xl font-bold text-glacier-white md:text-4xl">
                <SplitText text="What responders are saying." />
              </h2>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: easePremium }}
                  className="bg-white/[0.02] rounded-2xl p-6 md:p-8 ring-1 ring-white/[0.04] flex flex-col"
                >
                  <svg className="mb-4 text-crisis-red/30" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                  </svg>
                  <blockquote className="text-sm leading-relaxed text-cool-gray/80 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 pt-4 border-t border-white/[0.04]">
                    <div className="font-sora text-sm font-semibold text-glacier-white/90">{t.name}</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-cool-gray/50 mt-0.5">{t.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <CTAFooter />

        {/* ── Footer ── */}
        <footer className="relative border-t border-white/[0.04] py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="cross text-cool-gray/30" />
                <span className="font-sora text-sm font-semibold text-glacier-white/70">
                  DisasterTracker
                </span>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.2em] text-cool-gray/50">
                <span>Real-time intelligence</span>
                <span className="cross" style={{ width: '0.5rem', height: '0.5rem' }} />
                <span>&copy; {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

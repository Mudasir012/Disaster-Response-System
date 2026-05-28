import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Nav from './Nav'
import HeroScene from './HeroScene'
import Features from './Features'
import DataSources from './DataSources'
import CTAFooter from './CTAFooter'

const easePremium = [0.32, 0.72, 0, 1]

function useScrollReveal(delay = 0) {
  const reduced = useReducedMotion()
  return reduced ? {} : {
    initial: { opacity: 0, y: 32, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.8, delay, ease: easePremium },
  }
}

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const scrollRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const reduced = useReducedMotion()

  const globeOpacity = useTransform(scrollYProgress, [0, 0.12, 0.2, 0.85, 0.95], [1, 0.3, 0.15, 0.15, 0])

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      scrollRef.current = v
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
      <motion.div style={{ opacity: reduced ? 1 : globeOpacity }}>
        <HeroScene scrollRef={scrollRef} mouseRef={mouseRef} />
      </motion.div>

      <div className="relative z-10">
        <Nav />

        {/* Chapter 1: Hero */}
        <section className="relative min-h-[100dvh] flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 pt-24">
            <div className="max-w-3xl">
              <motion.span {...fadeIn(0.2)}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-cool-gray"
              >
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
                  className="group rounded-full bg-crisis-red px-8 py-4 font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-[0.98] flex items-center gap-3"
                >
                  Access Dashboard
                  <span className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Chapter 2: The Problem */}
        <section className="relative py-40 md:py-56">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...useScrollReveal()} className="max-w-3xl">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-crisis-red/70">
                The challenge
              </span>
              <h2 className="mt-4 font-sora text-4xl font-bold leading-tight text-glacier-white md:text-5xl">
                Every second matters.
                <br />
                But the data is scattered.
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
              {[
                { label: 'Seismic sensors', value: '24/7', note: 'USGS monitoring' },
                { label: 'Weather models', value: 'Real-time', note: 'NOAA updates' },
                { label: 'Satellite imagery', value: 'Every 10 min', note: 'Geo coverage' },
                { label: 'News sources', value: '100k+/day', note: 'GDELT index' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: easePremium }}
                  className="bg-white/[0.03] rounded-xl px-5 py-6 ring-1 ring-white/[0.06]"
                >
                  <span className="font-sora text-lg font-bold text-glacier-white">{item.value}</span>
                  <span className="block mt-1 text-xs text-cool-gray/70">{item.label}</span>
                  <span className="block mt-0.5 text-[10px] font-mono text-cool-gray/50">{item.note}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Chapter 3: The Engine */}
        <section className="relative py-32 md:py-40">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...useScrollReveal()} className="max-w-3xl">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-signal-blue/70">
                The pipeline
              </span>
              <h2 className="mt-4 font-sora text-4xl font-bold leading-tight text-glacier-white md:text-5xl">
                One pipeline.
                <br />
                One picture.
              </h2>
            </motion.div>

            <div className="mt-16">
              <Features />
            </div>
          </div>
        </section>

        {/* Chapter 4: The Sources */}
        <section className="relative py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...useScrollReveal()} className="mb-16 max-w-3xl">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-cool-gray/50">
                Our network
              </span>
              <h2 className="mt-4 font-sora text-3xl font-bold text-glacier-white md:text-4xl">
                Authoritative data, one pipeline.
              </h2>
            </motion.div>
            <DataSources />
          </div>
        </section>

        {/* Chapter 5: For Responders */}
        <section className="relative py-32 md:py-40">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...useScrollReveal()} className="max-w-3xl">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-amber/70">
                Built for
              </span>
              <h2 className="mt-4 font-sora text-4xl font-bold leading-tight text-glacier-white md:text-5xl">
                The people who act first.
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
                  className="bg-white/[0.03] rounded-xl p-6 md:p-8 ring-1 ring-white/[0.06]"
                >
                  <span className="font-sora text-lg font-bold text-glacier-white">{item.role}</span>
                  <span className="block mt-1 text-xs font-mono text-cool-gray/50">{item.context}</span>
                  <div className="mt-4 w-8 h-[2px] bg-crisis-red/50" />
                  <p className="mt-4 text-sm leading-relaxed text-cool-gray/80">{item.need}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative">
          <CTAFooter />
        </section>

        {/* Footer */}
        <footer className="relative border-t border-white/[0.04] py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <span className="font-sora text-sm font-semibold text-glacier-white/70">
                DisasterTracker
              </span>
              <span className="text-xs text-cool-gray/60">
                &copy; {new Date().getFullYear()} DisasterTracker. All rights reserved.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

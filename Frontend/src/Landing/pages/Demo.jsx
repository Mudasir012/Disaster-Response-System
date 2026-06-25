import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import Nav from '../Nav'
import Footer from '../components/Footer'
import { useScrollReveal, easePremium } from '../components/shared'

const screenshots = [
  {
    label: 'INCIDENT MAP',
    title: 'Real-time global incident map',
    desc: 'Color-coded severity markers, cluster aggregation, and region filtering let you assess the global picture in seconds.',
    bg: 'from-[#0d1117] to-[#1c2333]',
    accent: '#e94560',
    stats: [
      { label: 'ACTIVE INCIDENTS', value: '47' },
      { label: 'REGIONS', value: '23' },
      { label: 'AVG RESPONSE', value: '2.4s' },
    ],
  },
  {
    label: 'AI CLASSIFICATION',
    title: 'Intelligent event analysis',
    desc: 'Gemini AI extracts event type, severity score, location, and plain-English summary from every raw data source.',
    bg: 'from-[#0d1117] to-[#1a1040]',
    accent: '#7c3aed',
    stats: [
      { label: 'CLASSIFIED', value: '12.4k' },
      { label: 'CONFIDENCE', value: '94%' },
      { label: 'SOURCES', value: '6' },
    ],
  },
  {
    label: 'ANALYTICS DASHBOARD',
    title: 'Trends, distributions, forecasts',
    desc: 'Incident timelines, severity breakdowns, top affected regions, and disaster-type distribution charts.',
    bg: 'from-[#0a1628] to-[#0f3460]',
    accent: '#0f7ddb',
    stats: [
      { label: 'DATA POINTS', value: '240k' },
      { label: 'CHARTS', value: '8' },
      { label: 'UPDATE RATE', value: '15m' },
    ],
  },
]

export default function Demo() {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => setProgress(v))
  }, [scrollYProgress])

  return (
    <div className="landing relative min-h-screen bg-cream text-ink overflow-x-hidden">
      <a href="#demo-content" className="skip-link">Skip to content</a>

      <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-label="Page scroll progress">
        <div className="scroll-progress-track" />
        <div className="scroll-progress-bar" style={{ '--progress': progress, background: 'var(--color-acid)' }} />
      </div>

      <Nav />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-cream border-b border-ink/8">
        <div className="mx-auto max-w-4xl px-6 text-center py-32" id="demo-content">
          <motion.span {...useScrollReveal()}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">
            Interactive preview
          </motion.span>
          <motion.h1 {...useScrollReveal(0.1)}
            className="mt-6 font-display text-[clamp(44px,7vw,96px)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-ink">
            SEE SENTINEL<br />IN ACTION.
          </motion.h1>
          <motion.p {...useScrollReveal(0.2)}
            className="mt-6 mx-auto max-w-lg font-mono text-[12px] leading-relaxed text-ink/65">
            Explore the interface that emergency responders trust for real-time disaster intelligence.
          </motion.p>
        </div>
      </section>

      {/* ═══ DEMO SCREENSHOTS ═══ */}
      {screenshots.map((shot, i) => (
        <section key={shot.label}
          className={`relative py-24 md:py-36 overflow-hidden ${i % 2 === 0 ? 'bg-cream' : 'bg-mist'}`}>
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? 'direction-rtl' : ''}`}>
              <motion.div {...useScrollReveal()} className={`${i % 2 === 0 ? 'lg:col-span-7 lg:order-1' : 'lg:col-span-7 lg:order-2'}`}>
                <div className="relative rounded-sm overflow-hidden border border-ink/10 group">
                  <div className={`aspect-[16/10] bg-gradient-to-br ${shot.bg} p-4 md:p-6`}>
                    <div className="h-full w-full rounded-sm border border-white/10 overflow-hidden relative">
                      {/* Grid background */}
                      <div className="absolute inset-0 opacity-[0.04]"
                        style={{
                          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                          backgroundSize: '30px 30px',
                        }} />
                      {/* Glow accent */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-[0.08]"
                        style={{ background: shot.accent, filter: 'blur(40px)' }} />
                      {/* Mock content */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 backdrop-blur-sm border-b border-white/10 flex items-center px-3 gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: shot.accent }} />
                        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/50">{shot.label}</span>
                      </div>
                      {/* Stats grid */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-6 md:gap-10 px-6">
                          {shot.stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                              <div className="font-display text-2xl md:text-4xl font-extrabold tabular-nums"
                                style={{ color: shot.accent }}>
                                {stat.value}
                              </div>
                              <div className="mt-1 font-mono text-[7px] tracking-[0.12em] text-white/50">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Bottom bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-7 bg-white/5 backdrop-blur-sm border-t border-white/10 flex items-center px-3 gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: shot.accent }} />
                        <span className="font-mono text-[7px] text-white/40">Live · {shot.stats[0].value} data points</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 font-mono text-[8px] uppercase tracking-[0.14em] text-ink/40">
                    {shot.label}
                  </div>
                </div>
              </motion.div>

              <motion.div {...useScrollReveal(0.1)}
                className={`${i % 2 === 0 ? 'lg:col-span-5 lg:order-2' : 'lg:col-span-5 lg:order-1'}`}>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: shot.accent }}>
                  {shot.label}
                </span>
                <h2 className="mt-3 font-display text-[clamp(28px,4vw,52px)] font-extrabold uppercase leading-[0.94] tracking-[-0.015em] text-ink">
                  {shot.title}
                </h2>
                <p className="mt-4 max-w-sm font-mono text-[12px] leading-relaxed text-ink/65">
                  {shot.desc}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* ═══ CTA ═══ */}
      <section className="relative bg-cobalt py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 text-center">
          <motion.h2 {...useScrollReveal()}
            className="font-display text-[clamp(36px,6vw,80px)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-cream">
            READY TO SEE<br />IT YOURSELF?
          </motion.h2>
          <motion.div {...useScrollReveal(0.15)} className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/auth"
              className="group inline-flex items-center gap-3 bg-acid px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-all duration-300 hover:bg-cream active:scale-[0.98]">
              Access Dashboard
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

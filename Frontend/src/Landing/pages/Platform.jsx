import { useEffect, useState } from 'react'
import { motion, useScroll, useReducedMotion } from 'framer-motion'
import Nav from '../Nav'
import Footer from '../components/Footer'
import {
  easePremium, useScrollReveal, SpecimenTile, IridescentRender,
  GrainyRender, CalloutLine
} from '../components/shared'
import {
  SeismicWaveform3D,
  RadarSatellite3D,
  AINetwork3D,
  AlertBeacon3D,
} from '../components/ThreeDObjects'

const marqueePhrases = [
  'SEISMIC MONITORING', 'SATELLITE IMAGERY', 'HURRICANE TRACKING',
  'AI CLASSIFICATION', 'REAL-TIME ALERTS', 'MULTI-SOURCE FUSION',
  'GLOBAL COVERAGE', 'CRITICAL EVENT DETECTION', 'DISASTER RESPONSE',
]

export default function Platform() {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    return scrollYProgress.on('change', (v) => setProgress(v))
  }, [scrollYProgress])

  return (
    <div className="landing relative min-h-screen bg-cream text-ink overflow-x-hidden">
      <a href="#platform-content" className="skip-link">Skip to content</a>

      <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-label="Page scroll progress">
        <div className="scroll-progress-track" />
        <div className="scroll-progress-bar" style={{ '--progress': progress, background: 'var(--color-acid)' }} />
      </div>

      <Nav />

      {/* ═══ SECTION 1: STATEMENT ═══ */}
      <section id="platform-content" className="relative bg-mist py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <motion.div {...useScrollReveal()} className="lg:col-span-6 lg:col-start-1">
              <h2 className="font-display text-[clamp(40px,6vw,88px)] font-extrabold uppercase leading-[0.94] tracking-[-0.015em] text-ink">
                BETTER<br />RESOURCE<br />DECISIONS,<br />FASTER.
              </h2>
              <p className="mt-6 max-w-md font-mono text-[12px] leading-relaxed text-ink/65">
                When an earthquake strikes or a hurricane makes landfall, critical information is fragmented
                across agencies. Sentinel unifies every signal into one operational picture — so you act
                with confidence, not guesswork.
              </p>
            </motion.div>

            <motion.div {...useScrollReveal(0.15)} className="lg:col-span-6 relative">
              <div className="relative h-[340px] md:h-[420px] overflow-hidden rounded-sm">
                <IridescentRender className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="opacity-50">
                    <path d="M80 8L144 44V116L80 152L16 116V44L80 8Z" stroke="white" strokeWidth="0.8" strokeOpacity="0.5" fill="white" fillOpacity="0.04" />
                    <path d="M80 24L128 52V100L80 128L32 100V52L80 24Z" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                    <path d="M80 40L112 58V90L80 108L48 90V58L80 40Z" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" fill="none" />
                    <circle cx="80" cy="74" r="6" stroke="var(--color-acid)" strokeWidth="1" fill="none" opacity="0.7" />
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180
                      return (
                        <circle key={i}
                          cx={80 + Math.cos(rad) * 22}
                          cy={74 + Math.sin(rad) * 22}
                          r="2" fill="white" opacity="0.3" />
                      )
                    })}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180
                      return (
                        <line key={`l${i}`}
                          x1="80" y1="74"
                          x2={80 + Math.cos(rad) * 22}
                          y2={74 + Math.sin(rad) * 22}
                          stroke="white" strokeWidth="0.4" opacity="0.2" />
                      )
                    })}
                  </svg>
                </div>
                <CalloutLine caption="ACCURACY THROUGH REAL-TIME DATA FUSION"
                  style={{ bottom: -20, right: 40 }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: CAPABILITY ═══ */}
      <section className="relative bg-lavender py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <motion.div {...useScrollReveal()} className="lg:col-span-6 relative order-2 lg:order-1">
              <div className="relative h-[300px] md:h-[380px]">
                <div className="h-full w-full rounded-sm flex items-center justify-center overflow-hidden relative"
                  style={{ background: 'linear-gradient(135deg, #C2BCCB 0%, #d4d0dd 40%, #b8b1c2 100%)' }}>
                  <div className="absolute inset-0 opacity-[0.12]" style={{
                    backgroundImage: 'radial-gradient(circle, var(--color-coral) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }} />
                  <GrainyRender className="absolute inset-0 h-full w-full" />
                  <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 400 400" preserveAspectRatio="none">
                    {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((y, i) => (
                      <line key={`h${i}`} x1="0" y1={y} x2="400" y2={y} stroke="var(--color-coral)" strokeWidth="0.5" />
                    ))}
                    {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((x, i) => (
                      <line key={`v${i}`} x1={x} y1="0" x2={x} y2="400" stroke="var(--color-coral)" strokeWidth="0.5" />
                    ))}
                  </svg>
                  <svg className="absolute inset-0 w-full h-full opacity-[0.15]" viewBox="0 0 400 400">
                    <circle cx="200" cy="200" r="60" fill="none" stroke="var(--color-coral)" strokeWidth="1" />
                    <circle cx="200" cy="200" r="30" fill="none" stroke="var(--color-coral)" strokeWidth="0.5" />
                    <line x1="140" y1="200" x2="260" y2="200" stroke="var(--color-coral)" strokeWidth="0.5" />
                    <line x1="200" y1="140" x2="200" y2="260" stroke="var(--color-coral)" strokeWidth="0.5" />
                  </svg>
                </div>
                <CalloutLine caption="CORAL PARTICLE SIMULATION — SEISMIC DATA VISUALIZATION"
                  style={{ top: 20, right: -10 }} />
              </div>
            </motion.div>

            <motion.div {...useScrollReveal(0.15)} className="lg:col-span-6 order-1 lg:order-2">
              <h2 className="font-display text-[clamp(38px,5.5vw,80px)] font-extrabold uppercase leading-[0.94] tracking-[-0.015em] text-ink">
                ONE PIPELINE.<br />ONE PICTURE.<br /><span className="text-acid">ZERO NOISE.</span>
              </h2>
              <p className="mt-6 max-w-md font-mono text-[12px] leading-relaxed text-ink/65">
                USGS seismometers, NOAA hurricane trackers, GDACS disaster alerts, and GDELT news
                feeds converge into a single stream. Gemini AI classifies severity and extracts
                actionable intelligence — no false alarms, no wasted attention.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: SERVICES ═══ */}
      <section className="relative bg-emerald py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div {...useScrollReveal()} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
            <div className="md:col-span-2">
              <div className="specimen-tile bg-cream/10 h-full min-h-[160px] overflow-hidden relative">
                <SeismicWaveform3D reduced={reduced} />
              </div>
              <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.14em] text-cream/60">
                SEISMIC WAVEFORM ANALYSIS
              </span>
            </div>
            <SpecimenTile caption="SATELLITE + RADAR">
              <RadarSatellite3D reduced={reduced} />
            </SpecimenTile>
            <SpecimenTile caption="AI SEVERITY CLASSIFICATION">
              <AINetwork3D reduced={reduced} />
            </SpecimenTile>
            <SpecimenTile caption="REAL-TIME ALERT DISPATCH">
              <AlertBeacon3D reduced={reduced} />
            </SpecimenTile>
          </motion.div>

          <div className="hairline bg-cream/15 mb-14" />

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

        <div className="mt-16 relative z-10 border-t border-cream/10 pt-6">
          <MarqueeTicker phrases={marqueePhrases} />
        </div>
      </section>

      {/* ═══ SECTION 4: VISUAL SPECIMENS ═══ */}
      <section className="relative bg-cream py-20 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[
              {
                src: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&q=80&fit=crop&auto=format',
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
              <motion.div key={i} {...useScrollReveal(0.08 * i)} className="group">
                <div className="relative aspect-square overflow-hidden border border-ink/10 transition-all duration-500 group-hover:border-acid/60">
                  <div className="absolute inset-0 bg-cover bg-center saturate-[0.6] transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.src})` }} />
                  <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 128 128\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
                    backgroundSize: '128px 128px',
                  }} />
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-acid opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-ink/10 transition-colors duration-300 group-hover:bg-acid/40" />
                </div>
                <span className="mt-2.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-ink/60 leading-relaxed transition-colors duration-300 group-hover:text-ink/65">
                  {item.caption}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

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

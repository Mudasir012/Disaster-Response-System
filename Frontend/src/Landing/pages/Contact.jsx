import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import Nav from '../Nav'
import Footer from '../components/Footer'
import { useScrollReveal, MarqueeTicker, GrainyRender, AcidStar } from '../components/shared'
import { api } from '../../lib/api'

const marqueePhrases = [
  'SEISMIC MONITORING', 'SATELLITE IMAGERY', 'HURRICANE TRACKING',
  'AI CLASSIFICATION', 'REAL-TIME ALERTS', 'MULTI-SOURCE FUSION',
  'GLOBAL COVERAGE', 'CRITICAL EVENT DETECTION', 'DISASTER RESPONSE',
]

const inquiryTypes = [
  'General Inquiry',
  'Partnership',
  'Enterprise Licensing',
  'Technical Support',
  'Media / Press',
  'Other',
]

const initialForm = { name: '', email: '', organization: '', type: '', message: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Required'
  if (!values.email.trim()) errors.email = 'Required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Invalid email'
  if (!values.type) errors.type = 'Select one'
  if (!values.message.trim()) errors.message = 'Required'
  else if (values.message.trim().length < 10) errors.message = 'At least 10 characters'
  return errors
}

export default function Contact() {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  useEffect(() => {
    return scrollYProgress.on('change', (v) => setProgress(v))
  }, [scrollYProgress])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length) return

    setStatus('loading')
    try {
      await api.contact(form)
      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="landing relative min-h-screen bg-cream text-ink overflow-x-hidden">
      <a href="#contact-content" className="skip-link">Skip to content</a>

      <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-label="Page scroll progress">
        <div className="scroll-progress-track" />
        <div className="scroll-progress-bar" style={{ '--progress': progress, background: 'var(--color-acid)' }} />
      </div>

      <Nav />

      {/* ═══ HERO ═══ */}
      <section id="contact-content"
        className="relative min-h-[50vh] flex items-center overflow-hidden bg-cobalt border-b border-cream/10">
        <div className="mx-auto max-w-4xl px-6 py-32 text-center relative z-10">
          <motion.span {...useScrollReveal()}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">
            Get in touch
          </motion.span>
          <motion.h1 {...useScrollReveal(0.1)}
            className="mt-6 font-display text-[clamp(44px,7vw,96px)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-cream">
            CONTACT<br />SENTINEL.
          </motion.h1>
          <motion.p {...useScrollReveal(0.2)}
            className="mt-6 mx-auto max-w-lg font-mono text-[12px] leading-relaxed text-cream/70">
            Emergency response teams, humanitarian agencies, and government organizations.
          </motion.p>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative bg-emerald py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <motion.h2 {...useScrollReveal()}
                className="font-display text-[clamp(42px,7vw,100px)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-cream">
                MONITOR THE<br />PLANET.<br />PROTECT WHAT<br />MATTERS.
              </motion.h2>
              <motion.div {...useScrollReveal(0.15)} className="mt-10 flex flex-wrap gap-4">
                <a href="/auth"
                  className="group inline-flex items-center gap-3 bg-acid px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-all duration-300 hover:bg-cream active:scale-[0.98]">
                  Access Dashboard
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="/subscribe"
                  className="inline-flex items-center gap-3 border border-cream/30 px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-cream/80 transition-all duration-300 hover:border-cream hover:text-cream active:scale-[0.98]">
                  Subscribe to Alerts
                </a>
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

      {/* ═══ CONTACT FORM ═══ */}
      <section className="relative bg-cream py-24 md:py-32 overflow-hidden" id="contact-form">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left: form */}
            <motion.div {...useScrollReveal()} className="lg:col-span-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">Send a message</span>
              <h2 className="mt-3 font-display text-[clamp(28px,4vw,52px)] font-extrabold uppercase leading-[0.94] tracking-[-0.015em] text-ink">
                TELL US WHAT<br />YOU NEED.
              </h2>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 border border-acid/30 bg-acid/5 p-8"
                >
                  <AcidStar size="lg" />
                  <p className="mt-4 font-display text-xl font-bold text-ink">Message sent</p>
                  <p className="mt-2 font-mono text-[12px] leading-relaxed text-ink/65">
                    Thank you. Our team typically responds within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-acid hover:text-ink transition-colors duration-300"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">
                        Name <span className="text-crisis-red">*</span>
                      </label>
                      <input
                        id="name" name="name" type="text" value={form.name} onChange={handleChange}
                        className={`mt-2 w-full bg-transparent border px-4 py-3 font-mono text-[13px] text-ink placeholder:text-ink/30 transition-colors duration-300 focus:outline-none ${errors.name ? 'border-crisis-red/50' : 'border-ink/15 focus:border-ink/40'}`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="mt-1 font-mono text-[9px] text-crisis-red">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">
                        Email <span className="text-crisis-red">*</span>
                      </label>
                      <input
                        id="email" name="email" type="email" value={form.email} onChange={handleChange}
                        className={`mt-2 w-full bg-transparent border px-4 py-3 font-mono text-[13px] text-ink placeholder:text-ink/30 transition-colors duration-300 focus:outline-none ${errors.email ? 'border-crisis-red/50' : 'border-ink/15 focus:border-ink/40'}`}
                        placeholder="you@organization.org"
                      />
                      {errors.email && <p className="mt-1 font-mono text-[9px] text-crisis-red">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label htmlFor="organization" className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">
                      Organization
                    </label>
                    <input
                      id="organization" name="organization" type="text" value={form.organization} onChange={handleChange}
                      className="mt-2 w-full bg-transparent border border-ink/15 px-4 py-3 font-mono text-[13px] text-ink placeholder:text-ink/30 transition-colors duration-300 focus:border-ink/40 focus:outline-none"
                      placeholder="Agency, company, or institution"
                    />
                  </div>

                  {/* Inquiry type */}
                  <div>
                    <label htmlFor="type" className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">
                      Inquiry type <span className="text-crisis-red">*</span>
                    </label>
                    <select
                      id="type" name="type" value={form.type} onChange={handleChange}
                      className={`mt-2 w-full bg-transparent border px-4 py-3 font-mono text-[13px] text-ink transition-colors duration-300 focus:outline-none appearance-none ${errors.type ? 'border-crisis-red/50' : 'border-ink/15 focus:border-ink/40'}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2316150F' stroke-opacity='0.4' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                      }}
                    >
                      <option value="" disabled>Select inquiry type</option>
                      {inquiryTypes.map((t) => (
                        <option key={t} value={t} className="bg-cream text-ink">{t}</option>
                      ))}
                    </select>
                    {errors.type && <p className="mt-1 font-mono text-[9px] text-crisis-red">{errors.type}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">
                      Message <span className="text-crisis-red">*</span>
                    </label>
                    <textarea
                      id="message" name="message" rows="5" value={form.message} onChange={handleChange}
                      className={`mt-2 w-full bg-transparent border px-4 py-3 font-mono text-[13px] text-ink placeholder:text-ink/30 transition-colors duration-300 focus:outline-none resize-none ${errors.message ? 'border-crisis-red/50' : 'border-ink/15 focus:border-ink/40'}`}
                      placeholder="Describe your needs, timeline, and any specific questions..."
                    />
                    {errors.message && <p className="mt-1 font-mono text-[9px] text-crisis-red">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group inline-flex items-center gap-3 bg-ink px-8 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-acid hover:text-ink active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="h-3 w-3 rounded-full border border-cream/40 border-t-cream animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="font-mono text-[10px] text-crisis-red">
                      Failed to send. Please try again or email us directly.
                    </p>
                  )}
                </form>
              )}
            </motion.div>

            {/* Right: contact info + alert options */}
            <motion.div {...useScrollReveal(0.15)} className="lg:col-span-5">
              <div className="space-y-6 lg:mt-32">
                {[
                  { title: 'EMAIL', desc: 'Prefer email? Reach our team directly at operations@sentinel.dev', icon: '→' },
                  { title: 'RESPONSE TIME', desc: 'We respond to all inquiries within 24 hours, typically sooner for urgent requests.', icon: '→' },
                  { title: 'ENTERPRISE', desc: 'For organization-wide deployments, dedicated SLAs, and custom integrations.', icon: '→' },
                ].map((item) => (
                  <div key={item.title} className="border border-ink/10 p-6">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-acid">{item.title}</span>
                    <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink/65">{item.desc}</p>
                  </div>
                ))}

                <div className="border border-ink/10 p-6">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-acid">ALERT TYPES</span>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: 'EMAIL', color: '#e94560' },
                      { label: 'IN-APP', color: '#0f7ddb' },
                      { label: 'API WEBHOOK', color: '#7c3aed' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                        <span className="font-mono text-[11px] text-ink/65">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <a href="/subscribe"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-acid hover:text-ink transition-colors duration-300">
                    Configure alerts
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ ALERT DELIVERY OPTIONS ═══ */}
      <section className="relative border-t border-ink/8 bg-cream py-20 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div {...useScrollReveal()} className="text-center">
            <AcidStar size="lg" />
            <h2 className="mt-4 font-display text-[clamp(28px,4vw,48px)] font-extrabold uppercase leading-[0.94] tracking-[-0.015em] text-ink">
              STAY INFORMED.
            </h2>
            <p className="mt-3 mx-auto max-w-md font-mono text-[12px] leading-relaxed text-ink/65">
              Choose how you receive critical event notifications.
            </p>
          </motion.div>
          <motion.div {...useScrollReveal(0.15)}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'EMAIL', desc: 'Direct to your inbox with region, severity, and event type filters.', action: 'Subscribe', href: '/subscribe' },
              { title: 'IN-APP', desc: 'Real-time notifications within the Sentinel dashboard.', action: 'Dashboard', href: '/auth' },
              { title: 'API', desc: 'Integrate alerts into your own systems via webhooks.', action: 'Learn more', href: '/contact' },
            ].map((item) => (
              <div key={item.title} className="border border-ink/10 p-6 flex flex-col">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-acid">{item.title}</span>
                <p className="mt-3 flex-1 font-mono text-[11px] leading-relaxed text-ink/65">{item.desc}</p>
                <a href={item.href}
                  className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50 hover:text-acid transition-colors duration-300">
                  {item.action}
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

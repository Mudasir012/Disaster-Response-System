import { motion } from 'framer-motion'

const easeLusion = [0.4, 0, 0.1, 1]

function PillCTA({ href, label, variant = 'primary' }) {
  return (
    <a
      href={href}
      className={`cta-pill ${variant === 'primary'
        ? 'bg-crisis-red text-white hover:bg-white hover:text-crisis-red'
        : 'bg-white/[0.06] text-glacier-white/80 border border-white/10 hover:bg-white/10 hover:text-glacier-white hover:border-white/20'
      }`}
    >
      <span className="cta-dot" style={{ background: variant === 'primary' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)' }} />
      <span className="cta-text">{label}</span>
      <span className="cta-arrow">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}

export default function CTAFooter() {
  return (
    <section id="cta" className="relative py-32 md:py-40 overflow-hidden">
      <div className="grid-overlay" />

      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: easeLusion }}
        className="mx-auto max-w-4xl px-6 text-center relative"
      >
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-crisis-red/70">
          Get started
        </span>

        <h2 className="mt-6 font-sora text-4xl font-bold leading-tight text-glacier-white md:text-6xl">
          Monitor the planet.<br />Protect what matters.
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-cool-gray/70">
          Join agencies and responders worldwide who trust Sentinel
          for real-time intelligence.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <PillCTA href="/auth" label="Access Dashboard" variant="primary" />
          <PillCTA href="/auth" label="API Docs" variant="secondary" />
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-cool-gray/40">
        <span className="cross" />
        <span>Respond faster</span>
        <span className="cross" />
      </div>
    </section>
  )
}

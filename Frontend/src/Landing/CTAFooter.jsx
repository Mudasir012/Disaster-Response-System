import { motion } from 'framer-motion'

const easePremium = [0.32, 0.72, 0, 1]

export default function CTAFooter() {
  return (
    <div className="relative py-32 md:py-40 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #e94560, transparent 60%)',
        }}
      />
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: easePremium }}
        >
          <h2 className="font-sora text-4xl font-bold leading-tight text-glacier-white md:text-5xl">
            Monitor the planet.<br />Protect what matters.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-cool-gray/80">
            Join agencies and responders worldwide who trust DisasterTracker
            for real-time intelligence.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/auth"
              className="group rounded-full bg-crisis-red px-8 py-4 font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-[0.98] flex items-center gap-3"
            >
              Access Dashboard
              <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:scale-105">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>

            <a
              href="/auth"
              className="group rounded-full border border-white/10 px-8 py-4 font-semibold text-glacier-white/80 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/20 hover:text-glacier-white active:scale-[0.98] flex items-center gap-3"
            >
              API Docs
              <span className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

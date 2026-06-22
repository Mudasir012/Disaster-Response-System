import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Platform', href: '#section-statement' },
  { label: 'Services', href: '#section-services' },
  { label: 'Contact', href: '#section-cta' },
  { label: 'Alerts', href: '/subscribe' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroPassed, setHeroPassed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      setHeroPassed(window.scrollY > window.innerHeight * 0.6)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 flex justify-between items-center px-6 md:px-10 transition-all duration-500"
      style={{ paddingTop: scrolled ? '12px' : '28px', paddingBottom: '4px' }}
    >
      {/* Left: plus-logomark */}
      <a href="/" className="flex items-center gap-2.5 group" aria-label="Sentinel home">
        <span className="plus-logomark" aria-hidden="true">
          <span /><span /><span /><span />
        </span>
        <span
          className="hidden sm:inline font-mono text-[10px] font-bold uppercase tracking-[0.16em] transition-colors duration-300"
          style={{ color: heroPassed ? 'var(--color-ink)' : 'var(--color-sage)', opacity: heroPassed ? 0.7 : 0.6 }}
        >
          Sentinel
        </span>
      </a>

      {/* Right: mono nav links + CTA */}
      <div className="flex items-center gap-6 md:gap-8">
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="acid-link font-mono text-[10px] uppercase tracking-[0.14em] no-underline transition-colors duration-300"
              style={{ color: heroPassed ? 'var(--color-ink)' : 'var(--color-cream)', opacity: heroPassed ? 0.55 : 0.65 }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="/auth"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 active:scale-[0.97]"
          style={{
            background: heroPassed ? 'var(--color-ink)' : 'var(--color-cream)',
            color: heroPassed ? 'var(--color-cream)' : 'var(--color-ink)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-acid)'
            e.currentTarget.style.color = 'var(--color-ink)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = heroPassed ? 'var(--color-ink)' : 'var(--color-cream)'
            e.currentTarget.style.color = heroPassed ? 'var(--color-cream)' : 'var(--color-ink)'
          }}
        >
          Dashboard
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="relative flex h-6 w-6 items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`absolute h-[1.5px] w-5 transition-all duration-500 ${open ? 'rotate-45' : '-translate-y-1.5'}`}
            style={{ background: heroPassed ? 'var(--color-ink)' : 'var(--color-cream)' }}
          />
          <span
            className={`absolute h-[1.5px] w-5 transition-all duration-500 ${open ? '-rotate-45' : 'translate-y-1.5'}`}
            style={{ background: heroPassed ? 'var(--color-ink)' : 'var(--color-cream)' }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute left-4 right-4 top-20 bg-cream border border-ink/10 p-8"
          >
            <div className="flex flex-col gap-6">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink/60 hover:text-acid transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="/auth"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.24 }}
                className="mt-2 inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-cream hover:bg-acid hover:text-ink transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusLogomark } from './components/shared'

const links = [
  { label: 'Platform', href: '/platform' },
  { label: 'Demo', href: '/demo' },
  { label: 'Contact', href: '/contact' },
  { label: 'Alerts', href: '/subscribe' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroPassed, setHeroPassed] = useState(false)
  const ticking = useRef(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) {
      setHeroPassed(true)
      return
    }
    const sentinel = document.querySelector('.landing section:first-child')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-40% 0px 0px 0px' }
    )
    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [isHome])

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 flex justify-between items-center px-6 md:px-10 transition-all duration-500"
      style={{ paddingTop: scrolled ? '12px' : '28px', paddingBottom: '4px' }}
    >
      <Link to="/" className="flex items-center gap-2.5 group" aria-label="Sentinel home">
        <img src="/Sentinel.png" alt="Sentinel" className="h-11 w-auto" />
        <span
          className="hidden sm:inline font-mono text-[10px] font-bold uppercase tracking-[0.16em] transition-colors duration-300"
          style={{ color: heroPassed ? 'var(--color-ink)' : 'var(--color-sage)', opacity: heroPassed ? 0.7 : 0.6 }}
        >
          Sentinel
        </span>
      </Link>

      <div className="flex items-center gap-6 md:gap-8">
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="font-mono text-[10px] uppercase tracking-[0.14em] no-underline transition-colors duration-300 hover:text-acid"
              style={{ color: heroPassed ? 'var(--color-ink)' : 'var(--color-cream)', opacity: heroPassed ? 0.65 : 0.75 }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          to="/auth"
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
        </Link>

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
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <Link
                    to={link.href}
                    className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink/65 hover:text-acid transition-colors duration-200"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.24 }}
              >
                <Link
                  to="/auth"
                  className="mt-2 inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-cream hover:bg-acid hover:text-ink transition-all duration-300"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

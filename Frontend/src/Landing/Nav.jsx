import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Platform', href: '#features' },
  { label: 'Sources', href: '#sources' },
  { label: 'Contact', href: '#cta' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.1,1)]
        ${scrolled ? 'pt-3' : 'pt-6'}`}
    >
      <div
        className={`flex items-center gap-8 w-max rounded-full px-5 py-2.5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.1,1)]
          ${scrolled
            ? 'bg-black/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/[0.06]'
            : 'bg-transparent'
          }`}
      >
        <span className="font-sora text-sm font-bold tracking-tight text-glacier-white/90">
          DisasterTracker
        </span>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-sm text-cool-gray/80 hover:text-glacier-white transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.1,1)] after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-crisis-red after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="/auth"
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-crisis-red px-4 py-1.5 text-sm font-medium text-white transition-all duration-500 ease-[cubic-bezier(0.35,0,0,1)] hover:bg-white hover:text-crisis-red active:scale-[0.97]"
        >
          Access Dashboard
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative w-6 h-6 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <span className={`absolute h-[1.5px] w-5 bg-glacier-white/80 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
          <span className={`absolute h-[1.5px] w-5 bg-glacier-white/80 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="absolute top-20 left-4 right-4 backdrop-blur-3xl bg-black/80 rounded-2xl border border-white/[0.06] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col gap-4">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] }}
                  className="text-lg text-cool-gray/80 hover:text-glacier-white transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="/auth"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.24, ease: [0.32, 0.72, 0, 1] }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-crisis-red px-6 py-3 text-sm font-medium text-white"
                onClick={() => setOpen(false)}
              >
                Access Dashboard
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

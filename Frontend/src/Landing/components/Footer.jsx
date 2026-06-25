import { Link } from 'react-router-dom'
import { PlusLogomark, AcidStar } from './shared'

export default function Footer() {
  return (
    <footer className="relative bg-cream border-t border-ink/8 py-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Sentinel home">
              <PlusLogomark />
            </Link>
            <Link to="/" className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink/75 no-underline">
              Sentinel
            </Link>
            <AcidStar size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <Link to="/platform" className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65 no-underline hover:text-acid transition-colors duration-300">
              Platform
            </Link>
            <span className="font-mono text-[10px] text-ink/35">/</span>
            <Link to="/demo" className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65 no-underline hover:text-acid transition-colors duration-300">
              Demo
            </Link>
            <span className="font-mono text-[10px] text-ink/35">/</span>
            <Link to="/contact" className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65 no-underline hover:text-acid transition-colors duration-300">
              Contact
            </Link>
            <span className="font-mono text-[10px] text-ink/35">/</span>
            <Link to="/auth" className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65 no-underline hover:text-acid transition-colors duration-300">
              Dashboard
            </Link>
            <span className="font-mono text-[10px] text-ink/35">/</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

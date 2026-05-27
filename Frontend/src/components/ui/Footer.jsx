import { Link } from 'react-router-dom'

export default function Footer({ systemStatus = 'operational' }) {
  return (
    <footer className="bg-deep-slate border-t border-white/[0.06] pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-glacier-white mb-3 uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2">
              {[
                { to: '/map', label: 'Live Map' },
                { to: '/analytics', label: 'Analytics' },
                { to: '/alerts', label: 'Alerts' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-cool-gray hover:text-glacier-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-glacier-white mb-3 uppercase tracking-wider">Data Sources</h3>
            <ul className="space-y-2">
              {[
                { href: 'https://gdacs.org', label: 'GDACS' },
                { href: 'https://earthquake.usgs.gov', label: 'USGS' },
                { href: 'https://www.weather.gov', label: 'NOAA' },
                { href: 'https://newsapi.org', label: 'NewsAPI' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-cool-gray hover:text-glacier-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-glacier-white mb-3 uppercase tracking-wider">Project</h3>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'About' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-cool-gray hover:text-glacier-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-[11px] text-cool-gray/50 leading-relaxed space-y-1">
          <p>Data sourced from GDACS, USGS, NOAA, NewsAPI and social feeds. This platform is for informational purposes only.</p>
          <p>Not for emergency response decision-making. Always follow official emergency services guidance.</p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-cool-gray/40">&copy; 2026 DisasterTracker</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${systemStatus === 'operational' ? 'bg-safe-green animate-glow-pulse' : 'bg-amber'}`} />
            <span className="text-xs text-cool-gray/50 capitalize">{systemStatus}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

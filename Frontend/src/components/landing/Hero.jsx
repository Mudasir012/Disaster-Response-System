import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Shield } from 'lucide-react'
import { useIncidentStore } from '../../store/useIncidentStore'

const GlobeScene = lazy(() => import('./GlobeScene'))

export default function Hero() {
  const { statsSummary } = useIncidentStore()
  const stats = statsSummary || { active: 0, countries: 0, today: 0, critical: 0 }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-deep-slate">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,_rgba(233,69,96,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_80%,_rgba(15,125,219,0.05)_0%,_transparent_50%)]" />

      <div className="relative z-10 flex flex-col justify-center flex-1 w-full px-6 md:px-16 lg:px-20 pt-24 pb-12">
        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full lg:items-stretch">
          <div className="lg:col-span-7 lg:pr-8 lg:self-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-10 text-cool-gray text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-crisis-red animate-pulse-ring" />
              <span>Tracking disasters across {navigator?.language ? 'the globe' : '48+ countries'} right now</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.92]"
              style={{ fontFamily: "'Sora', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
            >
              <span className="text-glacier-white">See everything.</span>
              <br />
              <span className="text-glacier-white">Miss nothing.</span>
            </h1>

            <p className="text-base md:text-lg text-cool-gray max-w-lg mt-8 mb-10 leading-relaxed">
              We bring every disaster feed, every alert, every data point into one calm,
              clear picture. Built for the people who run toward trouble, so they can
              see what matters before anyone else.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/map"
                className="group inline-flex items-center gap-2.5 bg-crisis-red hover:bg-crisis-red/90 text-white text-base font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-crisis-red/25"
              >
                View Live Map
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 glass text-glacier-white text-base font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-white/10"
              >
                <Heart size={16} className="text-crisis-red" />
                Our Mission
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-12 text-xs text-cool-gray">
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-status-teal" />
                <span>Used by emergency teams</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-crisis-red animate-pulse-ring" />
                <span>Live data from 4 sources</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center h-[300px] sm:h-[400px] lg:h-full">
            <Suspense fallback={<div className="absolute inset-0 w-full h-full bg-deep-slate" />}>
              <GlobeScene className="absolute inset-0 w-full h-full" />
            </Suspense>

            <div className="relative z-10 self-end mb-8 md:mb-16 mr-auto ml-6 md:ml-8 glass rounded-2xl p-5 max-w-[200px] animate-float">
              <div className="text-[10px] font-semibold tracking-wider text-cool-gray/70 uppercase mb-2">Live Impact</div>
              <div className="text-2xl font-black text-glacier-white tabular-nums">{stats.active?.toLocaleString() || '0'}</div>
              <div className="text-xs text-cool-gray mt-0.5">active incidents</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-cool-gray">
                <span className="w-1 h-1 rounded-full bg-crisis-red animate-pulse-ring" />
                updating now
              </div>
            </div>

            <div className="absolute top-12 right-8 md:right-16 lg:right-24 flex gap-2 opacity-30 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-crisis-red/40" />
              <span className="w-2 h-2 rounded-full bg-signal-blue/30" />
              <span className="w-2 h-2 rounded-full bg-amber/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

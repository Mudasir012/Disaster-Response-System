import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import SeverityBadge, { getSeverityColor } from '../ui/SeverityBadge'
import { useIncidentStore } from '../../store/useIncidentStore'
import { timeAgo } from '../../utils/timeAgo'

function IncidentCard({ incident }) {
  return (
    <div className="shrink-0 w-[300px] glass rounded-xl overflow-hidden card-hover">
      <div className="h-1.5" style={{ backgroundColor: getSeverityColor(incident.severity) }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cool-gray">{incident.event_type.replace('_', ' ')}</span>
          <SeverityBadge severity={incident.severity} size="sm" />
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-glacier-white mb-1.5 truncate">
          <MapPin size={13} className="shrink-0 text-cool-gray" />
          <span className="truncate">{incident.location.name}</span>
        </div>
        <p className="text-xs text-cool-gray line-clamp-2 mb-3 leading-relaxed">{incident.summary}</p>
        <div className="flex items-center justify-between min-h-[44px]">
          <span className="text-[11px] text-cool-gray">{timeAgo(incident.created_at)}</span>
          <Link
            to={`/incident/${incident._id}`}
            className="inline-flex items-center gap-1 py-3 min-h-[44px] text-[11px] font-semibold text-signal-blue hover:text-signal-blue/80 transition-colors"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LivePreview() {
  const { incidents, fetchIncidents } = useIncidentStore()
  const scrollRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => { fetchIncidents({ limit: 10, sort: 'recent' }) }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || incidents.length === 0 || isPaused) return

    let raf
    let pos = 0
    const speed = 0.3

    const scroll = () => {
      pos += speed
      if (pos >= el.scrollWidth / 2) pos = 0
      el.scrollLeft = pos
      raf = requestAnimationFrame(scroll)
    }

    raf = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(raf)
  }, [incidents.length, isPaused])

  const displayIncidents = incidents.slice(0, 10)

  return (
    <section className="py-24 bg-deep-slate relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_100%,_rgba(233,69,96,0.03)_0%,_transparent_60%)]" />
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-10 min-h-[44px]">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-glacier-white">
              What&apos;s happening right now
            </h2>
            <p className="text-sm text-cool-gray mt-2 max-w-lg">
              Real incidents, pulled from live feeds. Updates every two minutes.
            </p>
          </div>
          <Link
            to="/map"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-3 min-h-[44px] text-sm font-semibold text-signal-blue hover:text-signal-blue/80 transition-colors shrink-0 rounded-lg hover:bg-signal-blue/5"
          >
            View all on map <ArrowRight size={15} />
          </Link>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {displayIncidents.length > 0 ? (
            [...displayIncidents, ...displayIncidents].map((inc, i) => (
              <div key={`${inc._id}-${i}`}>
                <IncidentCard incident={inc} />
              </div>
            ))
          ) : (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[300px] skeleton h-36 rounded-xl" />
            ))
          )}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            to="/map"
            className="group inline-flex items-center gap-2 bg-crisis-red hover:bg-crisis-red/90 text-white text-base font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-crisis-red/20"
          >
            View all {incidents.length > 0 ? incidents.length : ''} active incidents
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

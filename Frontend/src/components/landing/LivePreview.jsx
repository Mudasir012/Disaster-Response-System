import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import SeverityBadge, { getSeverityColor } from '../ui/SeverityBadge'
import { useIncidentStore } from '../../store/useIncidentStore'
import { timeAgo } from '../../utils/timeAgo'

function IncidentCard({ incident }) {
  return (
    <div className="shrink-0 w-[280px] bg-surface/60 backdrop-blur-sm border border-white/[0.06] rounded-lg overflow-hidden card-hover">
      <div className="h-1" style={{ backgroundColor: getSeverityColor(incident.severity) }} />
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-medium capitalize text-cool-gray/70">{incident.event_type.replace('_', ' ')}</span>
          <SeverityBadge severity={incident.severity} size="sm" />
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-glacier-white mb-1">
          <MapPin size={12} className="shrink-0 text-cool-gray/50" />
          <span className="truncate">{incident.location.name}</span>
        </div>
        <p className="text-xs text-cool-gray/70 line-clamp-2 mb-2 leading-relaxed">{incident.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-cool-gray/50">{timeAgo(incident.created_at)}</span>
          <Link to={`/incident/${incident._id}`} className="text-[11px] font-medium text-signal-blue hover:text-signal-blue/80 transition-colors">
            View on map →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LivePreview() {
  const { incidents, fetchIncidents } = useIncidentStore()
  const scrollRef = useRef(null)

  useEffect(() => { fetchIncidents({ limit: 6, sort: 'recent' }) }, [])

  const displayIncidents = incidents.slice(0, 6)

  return (
    <section className="py-16 bg-deep-slate relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,_rgba(233,69,96,0.04)_0%,_transparent_60%)]" />
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center mb-10 animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-bold text-glacier-white">What's happening right now</h2>
          <p className="text-sm text-cool-gray/60 mt-2">Updated every 2 minutes from live sources</p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-deep-slate to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-deep-slate to-transparent z-10 pointer-events-none" />

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {displayIncidents.length > 0 ? (
              displayIncidents.map((inc, i) => (
                <div key={inc._id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <IncidentCard incident={inc} />
                </div>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[280px] skeleton h-32" />
              ))
            )}
          </div>
        </div>

        <div className="text-center mt-8 animate-fade-in">
          <Link
            to="/map"
            className="group inline-flex items-center gap-2 bg-crisis-red hover:bg-crisis-red/90 text-white text-base font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-crisis-red/20"
          >
            See all {incidents.length > 0 ? incidents.length : ''} active incidents on the live map
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

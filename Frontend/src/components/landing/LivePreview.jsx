import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MapPin } from 'lucide-react'
import SeverityBadge from '../ui/SeverityBadge'
import { useIncidentStore } from '../../store/useIncidentStore'
import { getSeverityColor } from '../ui/SeverityBadge'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function IncidentCard({ incident }) {
  return (
    <div
      className="shrink-0 w-[280px] bg-surface border border-white/[0.08] rounded-lg overflow-hidden transition-all hover:border-white/20"
    >
      <div className="h-1" style={{ backgroundColor: getSeverityColor(incident.severity) }} />
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-medium capitalize text-cool-gray">{incident.event_type}</span>
          <SeverityBadge severity={incident.severity} size="sm" />
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-glacier-white mb-1">
          <MapPin size={12} className="shrink-0 text-cool-gray" />
          <span className="truncate">{incident.location.name}</span>
        </div>
        <p className="text-xs text-cool-gray line-clamp-2 mb-2">{incident.summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-cool-gray/60">
            <Clock size={10} />
            <span>{timeAgo(incident.created_at)}</span>
          </div>
          <Link to={`/incident/${incident._id}`} className="text-[11px] font-medium text-signal-blue hover:underline">
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
    <section className="py-16 bg-deep-slate">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-glacier-white">What's happening right now</h2>
          <p className="text-sm text-cool-gray mt-2">Updated every 2 minutes from live sources</p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-deep-slate to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-deep-slate to-transparent z-10 pointer-events-none" />

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {displayIncidents.length > 0 ? (
              displayIncidents.map((inc) => <IncidentCard key={inc._id} incident={inc} />)
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[280px] bg-surface/50 border border-white/[0.05] rounded-lg h-32 animate-pulse" />
              ))
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 bg-crisis-red hover:bg-crisis-red/90 text-white text-base font-semibold px-6 py-3 rounded-xl transition-all hover:scale-[1.02]"
          >
            See all {incidents.length > 0 ? incidents.length : ''} active incidents on the live map
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

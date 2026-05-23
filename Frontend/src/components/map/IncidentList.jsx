import { useNavigate } from 'react-router-dom'
import { SeverityDot } from '../ui/SeverityBadge'
import { useIncidentStore } from '../../store/useIncidentStore'
import { MapPin, Clock } from 'lucide-react'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export default function IncidentList({ onSelect }) {
  const { incidents } = useIncidentStore()
  const navigate = useNavigate()

  return (
    <div className="border-t border-white/[0.06] pt-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-cool-gray mb-2 px-1">
        Incidents ({incidents.length})
      </h3>
      <div className="space-y-0.5 max-h-[280px] overflow-y-auto">
        {incidents.map((inc) => (
          <button
            key={inc._id}
            onClick={() => {
              if (onSelect) onSelect(inc)
              else navigate(`/incident/${inc._id}`)
            }}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors text-left"
          >
            <SeverityDot severity={inc.severity} />
            <span className="text-xs font-medium capitalize text-cool-gray shrink-0 w-16 truncate">{inc.event_type}</span>
            <span className="text-xs text-glacier-white truncate flex-1">{inc.location.name}</span>
            <div className="flex items-center gap-1 text-[11px] text-cool-gray/60 shrink-0">
              <Clock size={9} />
              <span>{timeAgo(inc.created_at)}</span>
            </div>
          </button>
        ))}
        {incidents.length === 0 && (
          <p className="text-xs text-cool-gray/50 px-2 py-4 text-center">No incidents match filters</p>
        )}
      </div>
    </div>
  )
}

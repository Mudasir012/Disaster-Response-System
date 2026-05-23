import { useNavigate } from 'react-router-dom'
import { SeverityDot } from '../ui/SeverityBadge'
import { useIncidentStore } from '../../store/useIncidentStore'
import { timeAgo } from '../../utils/timeAgo'

export default function IncidentList({ onSelect }) {
  const { incidents } = useIncidentStore()
  const navigate = useNavigate()

  return (
    <div className="border-t border-white/[0.05] pt-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-cool-gray/60 mb-2 px-1">
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
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors text-left group"
          >
            <SeverityDot severity={inc.severity} />
            <span className="text-xs font-medium capitalize text-cool-gray/70 shrink-0 w-16 truncate">{inc.event_type.replace('_', ' ')}</span>
            <span className="text-xs text-glacier-white truncate flex-1 group-hover:text-glacier-white/90">{inc.location.name}</span>
            <span className="text-[11px] text-cool-gray/50 shrink-0">{timeAgo(inc.created_at)}</span>
          </button>
        ))}
        {incidents.length === 0 && (
          <p className="text-xs text-cool-gray/40 px-2 py-6 text-center">No incidents match filters</p>
        )}
      </div>
    </div>
  )
}

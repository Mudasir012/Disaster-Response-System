import { memo } from 'react'
import { SEVERITY } from './constants'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const IncidentCard = memo(function IncidentCard({ incident, selected, onSelect }) {
  const sev = SEVERITY[incident.severity] || SEVERITY.info

  return (
    <button
      onClick={() => onSelect?.(incident.id)}
      className={`w-full text-left rounded-xl transition-all duration-200 ${
        selected ? 'bg-white/[0.06] ring-1 ring-white/[0.1]' : 'bg-surface hover:bg-white/[0.04]'
      }`}
      style={{ boxShadow: selected ? `inset 0 0 0 1px ${sev.color}30` : 'none' }}
    >
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0" style={{ background: sev.color }} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-glacier-white truncate">{incident.type}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${incident.status === 'active' ? 'text-status-teal' : incident.status === 'monitoring' ? 'text-amber' : 'text-cool-gray/50'}`}
                  style={{ background: incident.status === 'active' ? 'rgba(13,148,136,0.1)' : incident.status === 'monitoring' ? 'rgba(217,119,6,0.1)' : 'rgba(148,163,184,0.1)' }}
                >
                  {incident.status}
                </span>
              </div>
              <p className="text-xs text-cool-gray/60 mt-0.5 truncate">{incident.location}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-mono text-[10px] font-semibold text-cool-gray/50">{timeAgo(incident.timestamp)}</span>
            {incident.magnitude > 0 && (
              <p className="font-mono text-[11px] text-cool-gray/60 mt-0.5">M {incident.magnitude}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-cool-gray/50 mt-2 leading-relaxed line-clamp-2">{incident.summary}</p>
        <div className="flex items-center gap-3 mt-2.5">
          {incident.casualties > 0 && (
            <span className="text-[10px] text-crisis-red/70 font-medium">{incident.casualties} casualties</span>
          )}
          <span className="text-[10px] text-cool-gray/40">{incident.affected.toLocaleString()} affected</span>
          <span className="text-[10px] text-cool-gray/30 font-mono">{incident.source}</span>
        </div>
      </div>
    </button>
  )
})

export default IncidentCard

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ExternalLink, MapPin, Bell, Share2 } from 'lucide-react'
import SeverityBadge from '../ui/SeverityBadge'
import { useIncidentStore } from '../../store/useIncidentStore'
import { timeAgo } from '../../utils/timeAgo'

export default function DetailPanel({ incidentId, onClose }) {
  const { activeIncident, fetchIncident } = useIncidentStore()
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (incidentId) fetchIncident(incidentId)
  }, [incidentId])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => onClose(), 250)
  }

  if (!activeIncident) return null

  const inc = activeIncident

  return (
    <div className={`absolute right-0 top-0 bottom-0 w-full md:w-[380px] max-w-[95vw] bg-deep-slate/95 backdrop-blur-xl border-l border-white/[0.06] z-20 overflow-y-auto shadow-2xl ${
      closing ? 'animate-slide-out' : 'animate-slide-in-right'
    }`}>
      <div className="sticky top-0 bg-deep-slate/95 backdrop-blur-xl border-b border-white/[0.06] p-4 flex items-center justify-between">
        <SeverityBadge severity={inc.severity} />
        <button onClick={handleClose} aria-label="Close detail panel" className="p-2.5 rounded-md text-cool-gray hover:text-glacier-white hover:bg-white/10 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-glacier-white capitalize">{inc.event_type.replace('_', ' ')}</h2>
          {inc.subtype && <p className="text-sm text-cool-gray/70">{inc.subtype}</p>}
          <div className="flex items-center gap-1.5 text-sm text-glacier-white mt-2">
            <MapPin size={14} className="text-cool-gray/50" />
            <span>{inc.location.name}</span>
          </div>
          <div className="text-[11px] font-mono text-cool-gray/40 mt-0.5">
            {inc.location.lat?.toFixed(4)}, {inc.location.lng?.toFixed(4)}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-cool-gray/50">
          <span>Updated {timeAgo(inc.last_updated)}</span>
          {inc.ai_confidence && (
            <span className="ml-auto text-ai-purple/80">AI: {Math.round(inc.ai_confidence * 100)}%</span>
          )}
        </div>

        <div className="bg-ai-purple/[0.06] border border-ai-purple/20 rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] font-semibold text-ai-purple bg-ai-purple/15 px-2 py-0.5 rounded">AI GENERATED</span>
          </div>
          <p className="text-sm text-glacier-white leading-relaxed">{inc.summary}</p>
          <p className="text-[11px] text-cool-gray/50 mt-2">From {inc.source_count} sources</p>
        </div>

        {inc.stats && (
          <div className="grid grid-cols-2 gap-2">
            {inc.stats.magnitude && (
              <div className="bg-surface/50 rounded-lg p-3 border border-white/[0.05]">
                <div className="text-[11px] text-cool-gray/60">Magnitude</div>
                <div className="text-lg font-bold text-glacier-white">{inc.stats.magnitude}</div>
              </div>
            )}
            {inc.stats.deaths != null && (
              <div className="bg-surface/50 rounded-lg p-3 border border-white/[0.05]">
                <div className="text-[11px] text-cool-gray/60">Deaths</div>
                <div className="text-lg font-bold text-crisis-red">{inc.stats.deaths.toLocaleString()}</div>
              </div>
            )}
            {inc.stats.displaced != null && (
              <div className="bg-surface/50 rounded-lg p-3 border border-white/[0.05]">
                <div className="text-[11px] text-cool-gray/60">Displaced</div>
                <div className="text-lg font-bold text-amber">{inc.stats.displaced.toLocaleString()}</div>
              </div>
            )}
            {inc.stats.wind_speed && (
              <div className="bg-surface/50 rounded-lg p-3 border border-white/[0.05]">
                <div className="text-[11px] text-cool-gray/60">Wind Speed</div>
                <div className="text-lg font-bold text-signal-blue">{inc.stats.wind_speed} km/h</div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Link to={`/incident/${inc._id}`}
            className="flex items-center gap-1.5 bg-surface/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-glacier-white card-hover">
            <ExternalLink size={14} />
            Full Details
          </Link>
          <button className="flex items-center gap-1.5 bg-status-teal/15 text-status-teal border border-status-teal/20 rounded-lg px-3 py-2 text-sm card-hover">
            <Bell size={14} />
            Alert me
          </button>
          <button className="flex items-center gap-1.5 bg-surface/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-cool-gray card-hover">
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

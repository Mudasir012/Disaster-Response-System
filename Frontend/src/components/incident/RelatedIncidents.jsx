import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SeverityBadge from '../ui/SeverityBadge'
import { api } from '../../lib/api'
import { mockIncidents } from '../../data/mockData'
import { timeAgo } from '../../utils/timeAgo'

export default function RelatedIncidents({ incidentId }) {
  const [related, setRelated] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const useMockData = !import.meta.env.VITE_API_URL
    if (useMockData) {
      setRelated(mockIncidents.filter((i) => i._id !== incidentId).slice(0, 3))
      return
    }
    api.relatedIncidents(incidentId).then(setRelated).catch(() => setRelated([]))
  }, [incidentId])

  if (!related.length) return null

  return (
    <div className="bg-surface/50 border border-white/[0.06] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-glacier-white mb-4">Related Incidents</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {related.map((inc, i) => (
          <button
            key={inc._id}
            onClick={() => navigate(`/incident/${inc._id}`)}
            className="shrink-0 w-48 bg-deep-slate/50 border border-white/[0.06] rounded-lg p-3 text-left card-hover"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium capitalize text-cool-gray/70">{inc.event_type.replace('_', ' ')}</span>
              <SeverityBadge severity={inc.severity} size="sm" />
            </div>
            <div className="text-sm font-medium text-glacier-white truncate">{inc.location.name}</div>
            <div className="text-[11px] text-cool-gray/50 mt-1">{timeAgo(inc.created_at)}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SeverityBadge from '../ui/SeverityBadge'
import { api } from '../../lib/api'
import { mockIncidents } from '../../data/mockData'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

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
    <div className="bg-surface border border-white/[0.08] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-glacier-white mb-4">Related Incidents</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {related.map((inc) => (
          <button
            key={inc._id}
            onClick={() => navigate(`/incident/${inc._id}`)}
            className="shrink-0 w-48 bg-deep-slate border border-white/[0.06] rounded-lg p-3 text-left hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium capitalize text-cool-gray">{inc.event_type}</span>
              <SeverityBadge severity={inc.severity} size="sm" />
            </div>
            <div className="text-sm font-medium text-glacier-white truncate">{inc.location.name}</div>
            <div className="text-[11px] text-cool-gray/60 mt-1">{timeAgo(inc.created_at)}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Edit3, Trash2, RefreshCw } from 'lucide-react'
import { SeverityDot } from '../ui/SeverityBadge'
import { useNavigate } from 'react-router-dom'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function IncidentTable({ incidents, onEdit, onDelete, onReprocess }) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selected.length === incidents.length) setSelected([])
    else setSelected(incidents.map((i) => i._id))
  }

  if (!incidents || !incidents.length) {
    return (
      <div className="bg-surface border border-white/[0.08] rounded-xl p-8 text-center text-sm text-cool-gray">
        No incidents found.
      </div>
    )
  }

  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="w-8 px-3 py-3">
                <input type="checkbox" aria-label="Select all incidents"
                  checked={selected.length === incidents.length}
                  onChange={toggleAll} className="accent-signal-blue" />
              </th>
              <th className="text-left text-[11px] text-cool-gray font-medium uppercase tracking-wider px-3 py-3">Severity</th>
              <th className="text-left text-[11px] text-cool-gray font-medium uppercase tracking-wider px-3 py-3">Type</th>
              <th className="text-left text-[11px] text-cool-gray font-medium uppercase tracking-wider px-3 py-3">Location</th>
              <th className="text-left text-[11px] text-cool-gray font-medium uppercase tracking-wider px-3 py-3">Summary</th>
              <th className="text-left text-[11px] text-cool-gray font-medium uppercase tracking-wider px-3 py-3">Sources</th>
              <th className="text-left text-[11px] text-cool-gray font-medium uppercase tracking-wider px-3 py-3">Updated</th>
              <th className="text-right text-[11px] text-cool-gray font-medium uppercase tracking-wider px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer"
                onClick={() => navigate(`/incident/${inc._id}`)}>
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" aria-label={`Select incident ${inc._id}`}
                    checked={selected.includes(inc._id)}
                    onChange={() => toggleSelect(inc._id)} className="accent-signal-blue" />
                </td>
                <td className="px-3 py-2.5"><SeverityDot severity={inc.severity} /></td>
                <td className="px-3 py-2.5 text-glacier-white capitalize">{inc.event_type.replace('_', ' ')}</td>
                <td className="px-3 py-2.5 text-cool-gray max-w-[150px] truncate">{inc.location?.name}</td>
                <td className="px-3 py-2.5 text-cool-gray max-w-[200px] truncate">{inc.summary}</td>
                <td className="px-3 py-2.5 text-cool-gray">{inc.source_count || '-'}</td>
                <td className="px-3 py-2.5 text-cool-gray/60 text-xs">{timeAgo(inc.last_updated)}</td>
                <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit?.(inc)}
                      aria-label="Edit incident"
                      className="p-2.5 rounded text-cool-gray hover:text-glacier-white hover:bg-white/5 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => onReprocess?.(inc._id)}
                      aria-label="Reprocess incident"
                      className="p-2.5 rounded text-cool-gray hover:text-ai-purple hover:bg-ai-purple/10 transition-colors">
                      <RefreshCw size={13} />
                    </button>
                    <button onClick={() => onDelete?.(inc._id)}
                      aria-label="Delete incident"
                      className="p-2.5 rounded text-cool-gray hover:text-crisis-red hover:bg-crisis-red/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected.length > 0 && (
        <div className="px-4 py-3 border-t border-white/[0.06] flex items-center gap-2">
          <span className="text-xs text-cool-gray">{selected.length} selected</span>
          <button aria-label="Delete selected incidents" className="text-xs text-crisis-red hover:underline ml-auto min-h-[44px] px-3">Delete selected</button>
        </div>
      )}
    </div>
  )
}

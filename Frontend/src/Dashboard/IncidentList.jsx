import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from './DashboardLayout'
import FilterBar from './FilterBar'
import StatsBar from './StatsBar'
import { SEVERITY, SEVERITY_ORDER } from './constants'
import { api } from '../lib/api'
import { mapBackendIncidentToFrontend } from '../utils/mapper'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default function IncidentList() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    let active = true
    async function fetchIncidents() {
      try {
        setLoading(true)
        const data = await api.incidents({ limit: 100 })
        if (active) {
          const mapped = (data.incidents || []).map(mapBackendIncidentToFrontend)
          setIncidents(mapped)
        }
      } catch (err) {
        console.error('Failed to fetch real-time incidents:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchIncidents()
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    let list = [...incidents]
    if (filter) list = list.filter((i) => i.severity === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (i) =>
          i.location.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'timestamp') cmp = a.timestamp - b.timestamp
      else if (sortBy === 'severity') {
        cmp = SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
      } else if (sortBy === 'type') cmp = a.type.localeCompare(b.type)
      else if (sortBy === 'location') cmp = a.location.localeCompare(b.location)
      return sortDir === 'desc' ? -cmp : cmp
    })
    return list
  }, [incidents, filter, search, sortBy, sortDir])

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(field); setSortDir('desc') }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col min-h-0 p-6 relative">
        {/* Cross decorations */}
        <div className="pointer-events-none absolute top-4 left-4 text-cool-gray/[0.04]"><span className="cross" /></div>
        <div className="pointer-events-none absolute top-4 right-4 text-cool-gray/[0.04]"><span className="cross" /></div>

        <div className="flex flex-col gap-4 mb-5">
          <div className="flex items-center justify-between">
            <h1 className="font-sora text-xl font-bold text-glacier-white">Incidents</h1>
            <StatsBar incidents={incidents} />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <svg aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cool-gray/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by location, type, or ID..."
                aria-label="Search incidents"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-white/[0.06] bg-surface/50 pl-9 pr-3 py-2 text-xs text-glacier-white placeholder:text-cool-gray/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-signal-blue/40"
              />
            </div>
            <FilterBar activeFilter={filter} onFilterChange={setFilter} />
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-xl border border-white/[0.04] min-h-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {[
                  { key: 'id', label: 'ID', sortable: false },
                  { key: 'severity', label: 'Severity', sortable: true },
                  { key: 'type', label: 'Type', sortable: true },
                  { key: 'location', label: 'Location', sortable: true },
                  { key: 'timestamp', label: 'Time', sortable: true },
                  { key: 'status', label: 'Status', sortable: false },
                  { key: 'source', label: 'Source', sortable: false },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && toggleSort(col.key)}
                    className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-cool-gray/50 ${
                      col.sortable ? 'cursor-pointer hover:text-glacier-white transition-colors duration-200' : ''
                    } text-left`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && sortBy === col.key && (
                        <svg aria-hidden="true" className={`w-3 h-3 transition-transform duration-200 ${sortDir === 'asc' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-signal-blue animate-spin" />
                      <span className="text-xs text-cool-gray/50">Loading incidents...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <p className="text-sm text-cool-gray/40 font-medium">No incidents match your filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((inc) => {
                  const sev = SEVERITY[inc.severity] || SEVERITY.info
                  return (
                    <tr
                      key={inc.id}
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                      className="border-b border-white/[0.02] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.1,1)] hover:bg-white/[0.03] hover:shadow-[inset_2px_0_0_var(--color-crisis-red)] cursor-pointer group"
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-cool-gray/50">{inc.id}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: sev.bg, color: sev.color }}
                        >
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-glacier-white">{inc.type}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-cool-gray/70">{inc.location}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] text-cool-gray/50">{timeAgo(inc.timestamp)} ago</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            inc.status === 'active'
                              ? 'text-status-teal bg-status-teal/10'
                              : inc.status === 'monitoring'
                              ? 'text-amber bg-amber/10'
                              : 'text-cool-gray/40 bg-white/[0.04]'
                          }`}
                        >
                          {inc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] text-cool-gray/40 font-mono">{inc.source}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}


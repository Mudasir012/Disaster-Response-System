import { useState, useMemo } from 'react'
import FilterBar from './FilterBar'
import StatsBar from './StatsBar'
import IncidentCard from './IncidentCard'
import SidebarSkeleton from './SidebarSkeleton'
import { SEVERITY_ORDER } from './constants'

export default function SidebarPanel({ incidents, selectedId, onSelect, loading }) {
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = [...incidents]
    if (filter) {
      list = list.filter((i) => i.severity === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (i) =>
          i.location.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q)
      )
    }
    return SEVERITY_ORDER
      .flatMap((key) => list.filter((i) => i.severity === key))
      .concat(list.filter((i) => !SEVERITY_ORDER.includes(i.severity)))
  }, [incidents, filter, search])

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col bg-deep-slate border-l border-ink/[0.04]" style={{ contain: 'layout style paint' }}>
        <SidebarSkeleton />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-deep-slate border-l border-ink/[0.04]" style={{ contain: 'layout style paint' }}>
      <div className="shrink-0 px-4 pt-4 pb-3 space-y-3">
        <StatsBar incidents={incidents} />
        <div className="relative">
          <svg aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cool-gray/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search incidents..."
            aria-label="Search incidents"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-ink/[0.06] bg-ink/[0.03] pl-9 pr-3 py-2 text-xs text-glacier-white placeholder:text-cool-gray/70 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-acid/50"
          />
        </div>
        <FilterBar activeFilter={filter} onFilterChange={setFilter} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-cool-gray/70 font-medium">No incidents found</p>
            <p className="text-xs text-cool-gray/65 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map((inc) => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              selected={selectedId === inc.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { X } from 'lucide-react'
import FilterPanel from './FilterPanel'
import IncidentList from './IncidentList'
import { useFilterStore } from '../../store/useFilterStore'
import { useIncidentStore } from '../../store/useIncidentStore'

export default function Sidebar({ onSelectIncident, onClose }) {
  const { sidebarOpen, toggleSidebar } = useFilterStore()
  const { incidents, fetchIncidents } = useIncidentStore()

  useEffect(() => { fetchIncidents() }, [])

  const visibleCount = incidents.length

  return (
    <>
      {sidebarOpen && (
        <div className="hidden md:block fixed left-0 top-14 bottom-0 w-[300px] bg-deep-slate border-r border-white/[0.08] z-20 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-1">
              <div className="text-2xl font-bold text-crisis-red tabular-nums">{visibleCount}</div>
              <button onClick={onClose} className="p-1 rounded text-cool-gray hover:text-glacier-white hover:bg-white/5 md:hidden">
                <X size={16} />
              </button>
            </div>
            <div className="text-xs text-cool-gray">incidents matching filters</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <FilterPanel />
            <IncidentList onSelect={onSelectIncident} />
          </div>
        </div>
      )}
    </>
  )
}

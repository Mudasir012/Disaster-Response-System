import FilterPanel from './FilterPanel'
import IncidentList from './IncidentList'
import { useFilterStore } from '../../store/useFilterStore'
import { useIncidentStore } from '../../store/useIncidentStore'

export default function Sidebar({ onSelectIncident }) {
  const { sidebarOpen } = useFilterStore()
  const { incidents } = useIncidentStore()

  const visibleCount = incidents.length

  return (
    <>
      {sidebarOpen && (
        <div className="hidden md:block fixed left-0 top-14 bottom-0 w-[300px] bg-deep-slate/95 backdrop-blur-xl border-r border-white/[0.06] z-20 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/[0.05]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-crisis-red tabular-nums">{visibleCount}</span>
                <span className="text-xs text-cool-gray/50">incidents</span>
              </div>
            </div>
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

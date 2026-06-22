import { Fragment } from 'react'

const TYPE_LABELS = {
  vehicle: 'Vehicles',
  ambulance: 'Ambulances',
  personnel: 'Personnel',
  shelter: 'Shelters',
  supply_point: 'Supply Points',
  medical_post: 'Medical Posts',
}

const STATUS_LABELS = {
  available: 'Available',
  busy: 'Busy',
  critical: 'Critical',
}

function StatCard({ label, total, color, statuses, STATUS_COLORS }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-mono text-cool-gray/75 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-white font-mono">{total}</span>
      </div>
      <div className="flex gap-2 text-[11px] font-mono text-cool-gray/70">
        {Object.entries(STATUS_LABELS).map(([key, slabel]) => {
          const count = statuses?.[key] || 0
          if (!count) return null
          return (
            <span key={key} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[key] }} />
              {slabel}: {count}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default function ResourceSidebar({
  resources, filter, onFilter,
  selected, onSelect, loading, onRefresh,
  TYPE_COLORS, STATUS_COLORS,
  route, isochrones, clearOverlays, onRoute, onIsochrone,
  onAddClick, placing,
}) {
  const typeKeys = Object.keys(TYPE_LABELS)
  const totalResources = resources.length
  const selectedResource = selected ? resources.find((r) => r._id === selected) : null

  const counts = typeKeys.reduce((acc, key) => {
    const typeResources = resources.filter((r) => r.type === key)
    if (typeResources.length) acc[key] = typeResources
    return acc
  }, {})

  return (
    <div className="h-full flex flex-col bg-landing-bg/90 backdrop-blur-sm border-l border-white/5">
      <div className="flex-shrink-0 px-4 py-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-white font-mono tracking-wide">Resources</h2>
            <p className="text-[11px] text-cool-gray/70 font-mono mt-0.5">
              {loading ? 'Loading...' : `${totalResources} total`}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onAddClick}
              disabled={placing}
              className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded
                bg-purple-500/20 text-purple-700 border border-purple-500/30
                hover:bg-purple-500/30 transition-all
                disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              + Add
            </button>
            <button
              onClick={clearOverlays}
              disabled={!route && !isochrones.length}
              className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded
                bg-white/5 text-cool-gray/70 border border-white/5
                hover:bg-white/10 hover:text-white transition-all
                disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={onRefresh}
              className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded
                bg-white/5 text-cool-gray/70 border border-white/5
                hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onFilter('all')}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-white/[0.03] text-cool-gray/70 border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            All
          </button>
          {typeKeys.map((key) => {
            const typeCounts = counts[key]
            if (!typeCounts?.length) return null
            const count = typeCounts.length
            return (
              <button
                key={key}
                onClick={() => onFilter(key)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                  filter === key
                    ? 'text-white border-white/20'
                    : 'text-cool-gray/70 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
                style={{
                  background: filter === key ? `${TYPE_COLORS[key]}30` : 'rgba(255,255,255,0.03)',
                  borderColor: filter === key ? TYPE_COLORS[key] : undefined,
                }}
              >
                {TYPE_LABELS[key]} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats grid */}
      <div className="flex-shrink-0 grid grid-cols-2 gap-2 px-4 py-3 border-b border-white/5">
        {typeKeys.map((key) => {
          const typeResources = resources.filter((r) => r.type === key)
          if (!typeResources.length) return null
          const statuses = typeResources.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1
            return acc
          }, {})
          return (
            <StatCard
              key={key}
              label={TYPE_LABELS[key]}
              total={typeResources.length}
              color={TYPE_COLORS[key]}
              statuses={statuses}
              STATUS_COLORS={STATUS_COLORS}
            />
          )
        })}
      </div>

      {/* Resource list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <p className="text-[11px] text-cool-gray/65 font-mono mb-1">No resources yet</p>
            <p className="text-[10px] text-cool-gray/70 font-mono leading-relaxed">
              Click <span className="text-purple-600/60">+ Add</span> above or the floating<br />
              <span className="text-purple-600/60">+</span> button, then click the map to place one.
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-1">
            {resources.map((r) => {
              const isSelected = selected === r._id
              const [lng, lat] = r.location?.coordinates || [0, 0]
              const detail = r.details || {}

              return (
                <button
                  key={r._id}
                  onClick={() => onSelect?.(isSelected ? null : r._id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/[0.02] border-transparent hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: TYPE_COLORS[r.type] || '#6b7280' }}
                    />
                    <span className="text-xs font-semibold text-white font-mono truncate">
                      {r.name}
                    </span>
                    <span
                      className="ml-auto text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                      style={{
                        background: `${STATUS_COLORS[r.status]}20`,
                        color: STATUS_COLORS[r.status],
                      }}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-cool-gray/70 ml-4">
                    <span>{TYPE_LABELS[r.type] || r.type}</span>
                    <span>{lat?.toFixed(3)}, {lng?.toFixed(3)}</span>
                    {detail.capacity && <span>Cap: {detail.capacity}</span>}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected resource actions */}
      {selectedResource && (
        <div className="flex-shrink-0 p-3 border-t border-white/5 bg-white/[0.02]">
          <p className="text-[10px] font-mono text-cool-gray/70 uppercase tracking-wider mb-2">
            {selectedResource.name} — Actions
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                const allOthers = resources.filter(r => r._id !== selectedResource._id)
                const firstOther = allOthers[0]
                if (firstOther) {
                  const [slng, slat] = selectedResource.location.coordinates
                  const [dlng, dlat] = firstOther.location.coordinates
                  onRoute(
                    { lng: slng, lat: slat },
                    { lng: dlng, lat: dlat },
                  )
                }
              }}
              className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded
                bg-purple-500/20 text-purple-700 border border-purple-500/30
                hover:bg-purple-500/30 transition-all cursor-pointer"
            >
              Route to nearest
            </button>
            <button
              onClick={() => {
                const [lng, lat] = selectedResource.location.coordinates
                onIsochrone(lng, lat)
              }}
              className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded
                bg-purple-500/20 text-purple-700 border border-purple-500/30
                hover:bg-purple-500/30 transition-all cursor-pointer"
            >
              Coverage area
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

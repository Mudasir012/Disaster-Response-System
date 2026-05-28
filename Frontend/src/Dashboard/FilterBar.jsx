import { SEVERITY, SEVERITY_ORDER } from './constants'

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onFilterChange(null)}
        className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 ${
          !activeFilter
            ? 'bg-white/[0.08] text-glacier-white'
            : 'text-cool-gray/60 hover:text-glacier-white hover:bg-white/[0.04]'
        }`}
      >
        All
      </button>
      {SEVERITY_ORDER.map((key) => {
        const sev = SEVERITY[key]
        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 ${
              activeFilter === key
                ? 'text-glacier-white'
                : 'text-cool-gray/60 hover:text-glacier-white'
            }`}
            style={{
              background: activeFilter === key ? sev.bg : 'transparent',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sev.color }} />
            {sev.label}
          </button>
        )
      })}
    </div>
  )
}

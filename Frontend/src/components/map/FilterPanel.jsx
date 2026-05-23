import { useFilterStore } from '../../store/useFilterStore'

const disasterTypes = [
  { key: 'earthquake', label: 'Earthquake', color: 'text-crisis-red' },
  { key: 'flood', label: 'Flood', color: 'text-signal-blue' },
  { key: 'wildfire', label: 'Wildfire', color: 'text-amber' },
  { key: 'cyclone', label: 'Cyclone', color: 'text-ai-purple' },
  { key: 'tsunami', label: 'Tsunami', color: 'text-status-teal' },
  { key: 'severe_weather', label: 'Severe Weather', color: 'text-cool-gray' },
]

const timeRanges = [
  { value: '1h', label: 'Last hour' },
  { value: '6h', label: 'Last 6h' },
  { value: '24h', label: 'Last 24h' },
  { value: '7d', label: 'Last 7 days' },
  { value: 'all', label: 'All time' },
]

const regions = [
  { value: 'worldwide', label: 'Worldwide' },
  { value: 'asia', label: 'Asia' },
  { value: 'africa', label: 'Africa' },
  { value: 'europe', label: 'Europe' },
  { value: 'americas', label: 'Americas' },
  { value: 'oceania', label: 'Oceania' },
]

export default function FilterPanel() {
  const {
    types, severityMin, severityMax, timeRange, region,
    toggleType, setSeverityMin, setSeverityMax, setTimeRange, setRegion,
    resetFilters, setTypes,
  } = useFilterStore()

  const allSelected = types.length === 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-cool-gray">Disaster Type</h3>
        <button onClick={() => setTypes([])} className="text-[11px] text-signal-blue hover:underline">Select all</button>
      </div>
      <div className="space-y-1.5">
        {disasterTypes.map((dt) => (
          <label key={dt.key} className="flex items-center gap-2.5 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              allSelected || types.includes(dt.key)
                ? 'bg-signal-blue border-signal-blue'
                : 'border-white/20 group-hover:border-white/40'
            }`}>
              {(allSelected || types.includes(dt.key)) && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-glacier-white">{dt.label}</span>
          </label>
        ))}
      </div>

      <div className="border-t border-white/[0.06] pt-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-cool-gray mb-3">Severity</h3>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => {
            const colors = { 1: 'bg-slate-500', 2: 'bg-signal-blue', 3: 'bg-amber', 4: 'bg-orange-500', 5: 'bg-crisis-red' }
            const active = s >= severityMin && s <= severityMax
            return (
              <button
                key={s}
                onClick={() => { setSeverityMin(s); setSeverityMax(s) }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  active ? `${colors[s]} text-white scale-105` : 'bg-surface text-cool-gray border border-white/10 hover:border-white/30'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
        <input
          type="range"
          min={1} max={5} step={1}
          value={severityMin}
          onChange={(e) => setSeverityMin(Number(e.target.value))}
          className="w-full mt-2 accent-crisis-red"
        />
      </div>

      <div className="border-t border-white/[0.06] pt-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-cool-gray mb-2">Time Range</h3>
        <div className="flex flex-wrap gap-1.5">
          {timeRanges.map((tr) => (
            <button
              key={tr.value}
              onClick={() => setTimeRange(tr.value)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                timeRange === tr.value
                  ? 'bg-signal-blue text-white'
                  : 'text-cool-gray hover:text-glacier-white hover:bg-white/5'
              }`}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-cool-gray mb-2">Region</h3>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-glacier-white focus:outline-none focus:border-signal-blue/50"
        >
          {regions.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="w-full text-sm text-cool-gray hover:text-glacier-white border border-white/10 hover:border-white/30 rounded-lg py-2 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  )
}

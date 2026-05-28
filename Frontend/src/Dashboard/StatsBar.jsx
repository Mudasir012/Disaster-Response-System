import { SEVERITY, SEVERITY_ORDER } from './constants'

export default function StatsBar({ incidents }) {
  const active = incidents.filter((i) => i.status === 'active').length
  const monitoring = incidents.filter((i) => i.status === 'monitoring').length

  const severityCounts = {}
  SEVERITY_ORDER.forEach((key) => {
    severityCounts[key] = incidents.filter((i) => i.severity === key && i.status !== 'resolved').length
  })

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-status-teal animate-pulse" />
        <span className="text-sm font-semibold text-glacier-white">{active}</span>
        <span className="text-[11px] text-cool-gray/60">Active</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber" />
        <span className="text-sm font-semibold text-glacier-white">{monitoring}</span>
        <span className="text-[11px] text-cool-gray/60">Monitoring</span>
      </div>
      <div className="w-px h-6 bg-white/[0.06]" />
      {SEVERITY_ORDER.map((key) => {
        const count = severityCounts[key] || 0
        if (count === 0) return null
        const sev = SEVERITY[key]
        return (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sev.color }} />
            <span className="text-sm font-semibold text-glacier-white">{count}</span>
          </div>
        )
      })}
    </div>
  )
}

import { SEVERITY, SEVERITY_ORDER } from './constants'
import { Skeleton } from '../components/ui/skeleton'

export default function StatsBar({ incidents, loading }) {
  const active = incidents.filter((i) => i.status === 'active').length
  const monitoring = incidents.filter((i) => i.status === 'monitoring').length

  const severityCounts = {}
  SEVERITY_ORDER.forEach((key) => {
    severityCounts[key] = incidents.filter((i) => i.severity === key && i.status !== 'resolved').length
  })

  if (loading) {
    return (
      <div className="flex items-center gap-6" aria-label="Loading stats">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-2 h-2 !rounded-full" />
            <Skeleton className="w-5 h-3.5" />
            <Skeleton className="w-9 h-2.5" />
          </div>
        ))}
        <div className="w-px h-6 bg-ink/[0.06]" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Skeleton className="w-1.5 h-1.5 !rounded-full" />
            <Skeleton className="w-4 h-3.5" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-status-teal" />
        <span className="text-sm font-semibold text-glacier-white">{active}</span>
        <span className="text-[11px] text-cool-gray/70">Active</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber" />
        <span className="text-sm font-semibold text-glacier-white">{monitoring}</span>
        <span className="text-[11px] text-cool-gray/70">Monitoring</span>
      </div>
      <div className="w-px h-6 bg-ink/[0.06]" />
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

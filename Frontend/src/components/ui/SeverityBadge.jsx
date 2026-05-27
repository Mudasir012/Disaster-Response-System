import { AlertTriangle, AlertCircle, Circle, Info, Zap } from 'lucide-react'
import { severityConfig, getSeverityColor } from '../../utils/severity'

export default function SeverityBadge({ severity, size = 'md', showLabel = true, pulse = false }) {
  const config = severityConfig[severity] || severityConfig[1]
  const Icon = severity === 1 ? Circle : severity === 2 ? Info : severity === 3 ? AlertCircle : severity === 4 ? AlertTriangle : Zap
  const sizeMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
  const svgSizes = { sm: 10, md: 12, lg: 14 }

  if (!showLabel) {
    return (
      <div className={`rounded-full ${config.bg} ${pulse ? 'animate-pulse-ring' : ''}`}
        style={{ width: config.dotSize, height: config.dotSize }} />
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${config.bg}/20 ${config.text} ${sizeMap[size]}`}>
      <Icon size={svgSizes[size]} className="shrink-0" />
      <span className="font-semibold">{config.label}</span>
    </div>
  )
}

export function SeverityDot({ severity }) {
  const config = severityConfig[severity] || severityConfig[1]
  return <div className={`rounded-full shrink-0 ${config.bg}`} style={{ width: 8, height: 8 }} aria-label={`Severity ${severity}`} />
}

export function SeverityMapPin({ severity }) {
  const config = severityConfig[severity] || severityConfig[1]
  return (
    <div className={`rounded-full ${config.bg} ${severity >= 4 ? 'animate-pulse-ring' : ''}`}
      style={{ width: config.dotSize + 4, height: config.dotSize + 4,
        boxShadow: `0 0 8px ${config.color}40` }} />
  )
}

export { getSeverityColor }

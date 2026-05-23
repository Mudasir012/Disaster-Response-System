import { AlertTriangle, AlertCircle, Circle, Info, Zap } from 'lucide-react'

const severityConfig = {
  1: { label: 'MINOR', color: 'bg-slate-500', text: 'text-slate-300', icon: Circle, size: 8 },
  2: { label: 'LOW', color: 'bg-signal-blue', text: 'text-blue-300', icon: Info, size: 12 },
  3: { label: 'MODERATE', color: 'bg-amber', text: 'text-amber-200', icon: AlertCircle, size: 16 },
  4: { label: 'HIGH', color: 'bg-orange-500', text: 'text-orange-200', icon: AlertTriangle, size: 20 },
  5: { label: 'CRITICAL', color: 'bg-crisis-red', text: 'text-red-200', icon: Zap, size: 24 },
}

export default function SeverityBadge({ severity, size = 'md', showLabel = true, pulse = false }) {
  const config = severityConfig[severity] || severityConfig[1]
  const Icon = config.icon
  const sizeMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  if (!showLabel) {
    const px = { 8: 'w-2 h-2', 12: 'w-3 h-3', 16: 'w-4 h-4', 20: 'w-5 h-5', 24: 'w-6 h-6' }
    return (
      <div className={`rounded-full ${config.color} ${pulse ? 'animate-pulse-ring' : ''}`}
        style={{ width: config.size, height: config.size }} />
    )
  }

  const svgSizes = { sm: 10, md: 12, lg: 14 }
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${config.color} bg-opacity-20 ${config.text} ${sizeMap[size]}`}>
      <Icon size={svgSizes[size]} className="shrink-0" />
      <span className="font-semibold">{config.label}</span>
    </div>
  )
}

export function SeverityDot({ severity }) {
  const config = severityConfig[severity] || severityConfig[1]
  return <div className={`rounded-full shrink-0 ${config.color}`} style={{ width: 8, height: 8 }} />
}

export function SeverityMapPin({ severity }) {
  const config = severityConfig[severity] || severityConfig[1]
  const size = config.size + 4
  return (
    <div className={`rounded-full ${config.color} ${severity >= 4 ? 'animate-pulse-ring' : ''}`}
      style={{ width: size, height: size, boxShadow: `0 0 6px ${config.color.replace('bg-', '#')}` }} />
  )
}

export function getSeverityColor(severity) {
  const map = { 1: '#64748b', 2: '#0f7ddb', 3: '#d97706', 4: '#e94560', 5: '#dc2626' }
  return map[severity] || '#64748b'
}

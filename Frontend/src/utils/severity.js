export const severityConfig = {
  1: { label: 'MINOR', color: '#64748b', bg: 'bg-slate-500', text: 'text-cool-gray', dotSize: 8 },
  2: { label: 'LOW', color: '#0f7ddb', bg: 'bg-signal-blue', text: 'text-signal-blue', dotSize: 12 },
  3: { label: 'MODERATE', color: '#d97706', bg: 'bg-amber', text: 'text-amber', dotSize: 16 },
  4: { label: 'HIGH', color: '#e94560', bg: 'bg-crisis-red', text: 'text-crisis-red', dotSize: 20 },
  5: { label: 'CRITICAL', color: '#e94560', bg: 'bg-crisis-red', text: 'text-crisis-red', dotSize: 24 },
}

export function getSeverityColor(severity) {
  return severityConfig[severity]?.color || '#64748b'
}

export function getSeverityBg(severity) {
  return severityConfig[severity]?.bg || 'bg-slate-500'
}

export function getSeverityText(severity) {
  return severityConfig[severity]?.text || 'text-slate-300'
}

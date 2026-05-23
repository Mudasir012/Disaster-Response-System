export function severityLabel(severity) {
  return { 1: 'MINOR', 2: 'LOW', 3: 'MODERATE', 4: 'HIGH', 5: 'CRITICAL' }[severity] || 'MINOR'
}

export function severityFromScore(score) {
  if (score >= 4.5) return 5
  if (score >= 3.5) return 4
  if (score >= 2.5) return 3
  if (score >= 1.5) return 2
  return 1
}

export function sanitizeIncident(inc) {
  if (!inc) return null
  const obj = inc.toObject ? inc.toObject() : inc
  delete obj.__v
  return obj
}

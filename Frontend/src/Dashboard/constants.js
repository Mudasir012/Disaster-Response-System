export const SEVERITY = {
  info: { label: 'Info', color: '#0f7ddb', bg: 'rgba(15,125,219,0.12)', level: 1 },
  moderate: { label: 'Moderate', color: '#d97706', bg: 'rgba(217,119,6,0.12)', level: 2 },
  severe: { label: 'Severe', color: '#f97316', bg: 'rgba(249,115,22,0.12)', level: 3 },
  critical: { label: 'Critical', color: '#e94560', bg: 'rgba(233,69,96,0.2)', level: 4 },
  tsunami: { label: 'Tsunami', color: '#0d9488', bg: 'rgba(13,148,136,0.12)', level: 5 },
}

export const SEVERITY_ORDER = ['critical', 'severe', 'tsunami', 'moderate', 'info']

export const DISASTER_TYPES = {
  Earthquake: { color: '#e94560', glow: 'rgba(233,69,96,0.35)' },
  Hurricane: { color: '#0f7ddb', glow: 'rgba(15,125,219,0.35)' },
  Wildfire: { color: '#f97316', glow: 'rgba(249,115,22,0.35)' },
  Tsunami: { color: '#0d9488', glow: 'rgba(13,148,136,0.35)' },
  Flood: { color: '#06b6d4', glow: 'rgba(6,182,212,0.35)' },
  'Volcanic Eruption': { color: '#dc2626', glow: 'rgba(220,38,38,0.35)' },
  Landslide: { color: '#a16207', glow: 'rgba(161,98,7,0.35)' },
  Tornado: { color: '#7c3aed', glow: 'rgba(124,58,237,0.35)' },
}

export const INCIDENT_TYPES = Object.keys(DISASTER_TYPES)

export const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Incidents', path: '/incidents' },
  { label: 'Tracking', path: '/tracking' },
  { label: 'Analytics', path: '/analytics' },
]

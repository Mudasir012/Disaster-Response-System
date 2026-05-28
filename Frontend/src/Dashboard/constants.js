export const SEVERITY = {
  info: { label: 'Info', color: '#0f7ddb', bg: 'rgba(15,125,219,0.12)', level: 1 },
  moderate: { label: 'Moderate', color: '#d97706', bg: 'rgba(217,119,6,0.12)', level: 2 },
  severe: { label: 'Severe', color: '#e94560', bg: 'rgba(233,69,96,0.12)', level: 3 },
  critical: { label: 'Critical', color: '#e94560', bg: 'rgba(233,69,96,0.2)', level: 4 },
  tsunami: { label: 'Tsunami', color: '#0d9488', bg: 'rgba(13,148,136,0.12)', level: 5 },
}

export const SEVERITY_ORDER = ['critical', 'severe', 'tsunami', 'moderate', 'info']

export const INCIDENT_TYPES = [
  'Earthquake',
  'Hurricane',
  'Wildfire',
  'Tsunami',
  'Flood',
  'Volcanic Eruption',
  'Landslide',
  'Tornado',
]

export const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Incidents', path: '/incidents' },
  { label: 'Analytics', path: '/analytics' },
]

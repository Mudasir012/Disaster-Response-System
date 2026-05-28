export function mapBackendIncidentToFrontend(inc) {
  if (!inc) return null

  // Severity mapping:
  // Backend uses numbers 1-5.
  // Frontend expects keys: 'critical', 'severe', 'tsunami', 'moderate', 'info'
  let severityKey = 'info'
  if (inc.event_type?.toLowerCase() === 'tsunami') {
    severityKey = 'tsunami'
  } else if (inc.severity === 5) {
    severityKey = 'critical'
  } else if (inc.severity === 4) {
    severityKey = 'severe'
  } else if (inc.severity === 3) {
    severityKey = 'moderate'
  } else {
    severityKey = 'info'
  }

  // Event type mapping:
  // Backend uses lowercase: 'earthquake', 'flood', 'wildfire', 'cyclone', 'tsunami', 'severe_weather'
  // Frontend expects titlecase matching INCIDENT_TYPES: 'Earthquake', 'Hurricane', 'Wildfire', 'Tsunami', 'Flood', etc.
  const typeMap = {
    earthquake: 'Earthquake',
    flood: 'Flood',
    wildfire: 'Wildfire',
    cyclone: 'Hurricane',
    tsunami: 'Tsunami',
    severe_weather: 'Tornado',
  }
  const type = typeMap[inc.event_type] || inc.event_type || 'Unknown'

  return {
    id: inc._id || inc.id,
    type,
    severity: severityKey,
    magnitude: inc.stats?.magnitude || 0,
    lat: inc.location?.lat || 0,
    lng: inc.location?.lng || 0,
    location: inc.location?.name || inc.location?.country || 'Unknown Location',
    region: inc.location?.continent || 'Worldwide',
    timestamp: new Date(inc.created_at || inc.first_seen || Date.now()).getTime(),
    status: inc.status || 'active',
    summary: inc.summary || '',
    casualties: inc.stats?.deaths || 0,
    affected: inc.stats?.displaced || 0,
    source: inc.source_count > 0 ? 'Multiple' : 'GDACS',
  }
}

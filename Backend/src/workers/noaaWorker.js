export default async function fetchNOAA() {
  const url = 'https://api.weather.gov/alerts/active?status=actual&message_type=alert&urgency=Immediate,Expected'

  const res = await fetch(url, {
    headers: { 'User-Agent': 'DisasterTracker/1.0' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    console.warn(`[NOAA] HTTP ${res.status}`)
    return []
  }

  const data = await res.json()
  const features = data.features || []

  return features.map((f) => {
    const props = f.properties || {}
    const coords = f.geometry?.coordinates || []
    return {
      source: 'noaa',
      event_id: f.id || '',
      raw_text: `${props.headline || ''}. ${(props.description || '').slice(0, 300)}`,
      raw_payload: f,
      timestamp: new Date(props.sent || Date.now()),
      lat: coords[1] || null,
      lng: coords[0] || null,
    }
  })
}

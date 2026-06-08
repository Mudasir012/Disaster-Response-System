function extractCoord(geometry) {
  if (!geometry || !geometry.coordinates) return [null, null]
  const coords = geometry.coordinates
  if (geometry.type === 'Point') {
    return [coords[1] || null, coords[0] || null]
  }
  if (geometry.type === 'Polygon' && coords[0]?.[0]) {
    const centroid = coords[0].reduce(
      (acc, c) => [acc[0] + c[1], acc[1] + c[0]],
      [0, 0]
    )
    const n = coords[0].length
    return [centroid[0] / n, centroid[1] / n]
  }
  return [null, null]
}

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
    const [lat, lng] = extractCoord(f.geometry)

    return {
      source: 'noaa',
      event_id: f.id || '',
      raw_text: `${props.headline || ''}. ${(props.description || '').slice(0, 300)}`,
      raw_payload: f,
      timestamp: new Date(props.sent || Date.now()),
      lat,
      lng,
    }
  })
}

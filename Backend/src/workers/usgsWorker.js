export default async function fetchUSGS() {
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!res.ok) {
    console.warn(`[USGS] HTTP ${res.status}`)
    return []
  }

  const data = await res.json()
  const features = data.features || []

  return features.map((f) => {
    const coords = f.geometry.coordinates
    return {
      source: 'usgs',
      event_id: f.id,
      raw_text: `${f.properties.title}. Magnitude ${f.properties.mag}, depth ${coords[2]}km`,
      raw_payload: f,
      timestamp: new Date(f.properties.time),
      lat: coords[1],
      lng: coords[0],
      magnitude: f.properties.mag,
      depth_km: coords[2],
    }
  })
}

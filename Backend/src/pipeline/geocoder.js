import redis from '../config/redis.js'

let lastNominatimCall = 0

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function geocode(locationName, existingLat, existingLng) {
  if (existingLat && existingLng) {
    return { lat: existingLat, lng: existingLng }
  }

  if (!locationName) return { lat: null, lng: null }

  const cacheKey = `geo:${locationName.toLowerCase()}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)
  } catch {
    // cache miss, continue
  }

  const now = Date.now()
  const elapsed = now - lastNominatimCall
  if (elapsed < 1000) {
    await sleep(1000 - elapsed)
  }
  lastNominatimCall = Date.now()

  const nominatimEmail = process.env.NOMINATIM_EMAIL || 'dev@example.com'
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': `DisasterTracker/1.0 <${nominatimEmail}>` },
      signal: AbortSignal.timeout(10000),
    })
    const data = await res.json()

    if (data && data[0]) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      await redis.setex(cacheKey, 86400, JSON.stringify(result))
      return result
    }
  } catch (err) {
    console.warn(`[Geocoder] Nominatim error for "${locationName}":`, err.message)
  }

  return { lat: null, lng: null }
}

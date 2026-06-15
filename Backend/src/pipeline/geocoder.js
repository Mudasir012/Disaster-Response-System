import redis from '../config/redis.js'

let lastNominatimCall = 0

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function nominatimSearch(query) {
  const now = Date.now()
  const elapsed = now - lastNominatimCall
  if (elapsed < 1000) {
    await sleep(1000 - elapsed)
  }
  lastNominatimCall = Date.now()

  const nominatimEmail = process.env.NOMINATIM_EMAIL || 'dev@example.com'
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`

  const res = await fetch(url, {
    headers: { 'User-Agent': `DisasterTracker/1.0 <${nominatimEmail}>` },
    signal: AbortSignal.timeout(10000),
  })
  const data = await res.json()
  return data?.[0] || null
}

function simplifyLocation(name) {
  if (!name) return null
  let parts = name.split(',').map((s) => s.trim())
  if (parts.length > 1 && /\b(county|parish|city|town|village|municipality)\b/i.test(parts[0])) {
    parts.splice(0, 1, parts[0].replace(/\s+(county|parish|city|town|village|municipality).*/i, ''))
  }
  return parts.filter(Boolean).join(', ')
}

async function photonSearch(query) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) return null
  const data = await res.json()
  const feature = data.features?.[0]
  if (!feature) return null
  return {
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
  }
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
    // cache miss
  }

  const attempts = [locationName, simplifyLocation(locationName)].filter(Boolean)

  for (const query of [...new Set(attempts)]) {
    try {
      const result = await nominatimSearch(query)
      if (result) {
        const coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) }
        try { await redis.setex(cacheKey, 86400, JSON.stringify(coords)) } catch {}
        return coords
      }
    } catch (err) {
      console.warn(`[Geocoder] Nominatim error for "${query}":`, err.message)
    }

    try {
      const result = await photonSearch(query)
      if (result) {
        const coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) }
        try { await redis.setex(cacheKey, 86400, JSON.stringify(coords)) } catch {}
        return coords
      }
    } catch (err) {
      console.warn(`[Geocoder] Photon error for "${query}":`, err.message)
    }
  }

  return { lat: null, lng: null }
}

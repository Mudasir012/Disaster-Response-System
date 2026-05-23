import { config } from '../../config/index.js'

const cache = new Map()

export async function geocodeLocation(locationName) {
  if (!locationName) return null

  const cached = cache.get(locationName.toLowerCase())
  if (cached && Date.now() - cached.ts < 86400000) {
    return cached.data
  }

  const url = `${config.nominatimUrl}?format=json&q=${encodeURIComponent(locationName)}&limit=1`

  const res = await fetch(url, {
    headers: { 'User-Agent': config.userAgent + ' (' + config.nominatimEmail + ')' },
  })

  if (!res.ok) return null

  const data = await res.json()
  if (!data.length) return null

  const result = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    name: data[0].display_name,
  }

  cache.set(locationName.toLowerCase(), { data: result, ts: Date.now() })
  return result
}

export function getContinent(lat, lng) {
  if (lat > 0 && lng > -30 && lng < 60) return 'Europe'
  if (lat > 0 && lng > 60 && lng < 150) return 'Asia'
  if (lat > -40 && lat < 40 && lng > -20 && lng < 55) return 'Africa'
  if (lat > 15 && lng > -170 && lng < -50) return 'Americas'
  if (lat < -10 && lng > 110 && lng < 180) return 'Oceania'
  if (lat < 0 && lng > -80 && lng < -35) return 'Americas'
  if (lat > 0 && lng > -130 && lng < -60) return 'Americas'
  return 'Unknown'
}

import { Router } from 'express'
import { Incident } from '../models/Incident.js'
import { searchCities, getCountryName, countries } from '../services/cities.js'
import { fetchGDELTData } from '../services/gdeltApi.js'

const DISASTER_QUERY = 'earthquake OR flood OR wildfire OR cyclone OR tsunami OR hurricane OR tornado OR volcanic eruption OR landslide OR storm'

const router = Router()

router.get('/feed', async (req, res, next) => {
  try {
    let { location } = req.query
    location = (location || '').trim()
    const cacheKey = location ? `feed:${location}` : 'feed:global'

    const params = new URLSearchParams({
      query: location ? `(${DISASTER_QUERY}) AND (${location})` : DISASTER_QUERY,
      mode: 'ArtList',
      maxrecords: 25,
      format: 'json',
      sourcelang: 'english',
    })

    const result = await fetchGDELTData(params, cacheKey)

    if (result.error) {
      const fallback = await buildFallback(location)
      return res.json(fallback)
    }

    res.json({
      location: location || 'Global',
      total: result.total,
      articles: result.articles,
    })
  } catch (err) {
    next(err)
  }
})

router.get('/countries', (req, res) => {
  const { q } = req.query
  if (!q || q.trim().length < 2) return res.json({ countries: [] })
  const query = q.toLowerCase().trim()
  const results = countries
    .filter((c) => c.nameLower.startsWith(query))
    .slice(0, 10)
  res.json({ countries: results })
})

router.get('/cities', (req, res) => {
  const { q } = req.query
  if (!q || q.trim().length < 2) return res.json({ cities: [] })
  const results = searchCities(q, 12)
  res.json({
    cities: results.map((c) => ({
      name: c.name,
      country: c.country,
      countryName: getCountryName(c.country),
      population: c.population,
      lat: c.lat,
      lng: c.lng,
    })),
  })
})

async function buildFallback(location) {
  const filter = { status: { $in: ['active', 'monitoring'] } }
  if (location) {
    const regex = new RegExp(location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [
      { 'location.name': regex },
      { 'location.country': regex },
      { 'location.continent': regex },
      { 'location.region': regex },
    ]
  }

  const incidents = await Incident.find(filter)
    .sort({ severity: -1, created_at: -1 })
    .limit(10)
    .lean()

  return {
    location: location || 'Global',
    total: 0,
    articles: [],
    note: 'GDELT is temporarily rate-limited. Showing database incidents as fallback.',
    incidents: incidents.map((inc) => ({
      title: `[${inc.event_type?.toUpperCase()}] ${inc.location?.name || inc.location?.country || 'Unknown'} — ${inc.summary || ''}`,
      severity: inc.severity,
      status: inc.status,
      url: null,
    })),
  }
}

export default router

import { Router } from 'express'

const router = Router()
const ORS_BASE = 'https://api.openrouteservice.org'
const ORS_API_KEY = process.env.ORS_API_KEY || ''

router.post('/directions', async (req, res, next) => {
  try {
    const { coordinates, profile = 'driving-car', ...rest } = req.body
    if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({ error: 'coordinates array required' })
    }
    if (!ORS_API_KEY) {
      return res.status(503).json({ error: 'ORS API key not configured' })
    }

    const response = await fetch(`${ORS_BASE}/v2/directions/${profile}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ORS_API_KEY,
      },
      body: JSON.stringify({ coordinates, ...rest }),
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(response.status).json({ error: 'ORS error', detail: text })
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.post('/isochrones', async (req, res, next) => {
  try {
    const { location, profile = 'driving-car', range = [5000, 10000], ...rest } = req.body
    if (!location || !Array.isArray(location)) {
      return res.status(400).json({ error: 'location [lng, lat] required' })
    }
    if (!ORS_API_KEY) {
      return res.status(503).json({ error: 'ORS API key not configured' })
    }

    const response = await fetch(`${ORS_BASE}/v2/isochrones/${profile}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ORS_API_KEY,
      },
      body: JSON.stringify({ locations: [location], range, ...rest }),
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(response.status).json({ error: 'ORS error', detail: text })
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    next(err)
  }
})

router.get('/geocode/search', async (req, res, next) => {
  try {
    const { text, ...rest } = req.query
    if (!text) return res.status(400).json({ error: 'text query required' })
    if (!ORS_API_KEY) {
      return res.status(503).json({ error: 'ORS API key not configured' })
    }

    const params = new URLSearchParams({ text, ...rest })
    const response = await fetch(`${ORS_BASE}/geocode/search?${params}`, {
      headers: { Authorization: ORS_API_KEY },
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(response.status).json({ error: 'ORS error', detail: text })
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router

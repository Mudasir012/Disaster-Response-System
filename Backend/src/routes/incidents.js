import { Router } from 'express'
import { Incident } from '../models/Incident.js'
import { sanitizeIncident } from '../utils/helpers.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { severity, type, region, from, to, limit = 100, page = 1, sort = 'recent' } = req.query
    const filter = { status: { $ne: 'deleted' } }

    if (type) filter.event_type = type
    if (severity) {
      const [min, max] = severity.split('-').map(Number)
      filter.severity = { $gte: min || 0, $lte: max || 5 }
    }
    if (region && region !== 'worldwide') {
      filter['location.continent'] = region.charAt(0).toUpperCase() + region.slice(1).toLowerCase()
    }
    if (from || to) {
      filter.created_at = {}
      if (from) filter.created_at.$gte = new Date(from)
      if (to) filter.created_at.$lte = new Date(to)
    }

    const sortMap = { recent: { created_at: -1 }, severity: { severity: -1 }, updated: { last_updated: -1 } }
    const sortOrder = sortMap[sort] || sortMap.recent
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [incidents, total] = await Promise.all([
      Incident.find(filter).sort(sortOrder).skip(skip).limit(parseInt(limit)).lean(),
      Incident.countDocuments(filter),
    ])

    res.json({
      data: incidents.map(sanitizeIncident),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    })
  } catch (err) {
    next(err)
  }
})

router.get('/geojson', async (req, res, next) => {
  try {
    const { severity, type, region, from, to } = req.query
    const filter = { status: { $ne: 'deleted' }, 'location.lat': { $exists: true }, 'location.lng': { $exists: true } }

    if (type) filter.event_type = type
    if (severity) {
      const [min, max] = severity.split('-').map(Number)
      filter.severity = { $gte: min || 0, $lte: max || 5 }
    }
    if (region && region !== 'worldwide') {
      filter['location.continent'] = region.charAt(0).toUpperCase() + region.slice(1).toLowerCase()
    }
    if (from || to) {
      filter.created_at = {}
      if (from) filter.created_at.$gte = new Date(from)
      if (to) filter.created_at.$lte = new Date(to)
    }

    const MAX = parseInt(req.query.limit) || 500
    const incidents = await Incident.find(filter).sort({ created_at: -1 }).limit(MAX).lean()

    const features = incidents.map((inc) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [inc.location.lng, inc.location.lat] },
      properties: {
        _id: inc._id,
        event_type: inc.event_type,
        severity: inc.severity,
        severity_label: inc.severity_label,
        location_name: inc.location.name,
        summary: inc.summary?.slice(0, 100),
        created_at: inc.created_at,
      },
    }))

    res.json({ type: 'FeatureCollection', features })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('sources')
      .lean()
    if (!incident) return res.status(404).json({ message: 'Incident not found' })
    res.json(sanitizeIncident(incident))
  } catch (err) {
    next(err)
  }
})

router.get('/:id/related', async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
    if (!incident) return res.status(404).json({ message: 'Incident not found' })

    const radius = parseFloat(req.query.radius_km) || 500
    const deg = radius / 111

    const related = await Incident.find({
      _id: { $ne: incident._id },
      'location.lat': { $gte: incident.location.lat - deg, $lte: incident.location.lat + deg },
      'location.lng': { $gte: incident.location.lng - deg, $lte: incident.location.lng + deg },
      created_at: { $gte: new Date(Date.now() - 86400000 * 7) },
      status: { $ne: 'deleted' },
    }).sort({ created_at: -1 }).limit(5).lean()

    res.json(related.map(sanitizeIncident))
  } catch (err) {
    next(err)
  }
})

export default router

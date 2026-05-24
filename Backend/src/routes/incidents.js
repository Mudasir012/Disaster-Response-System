import { Router } from 'express'
import { Incident } from '../models/Incident.js'
import { AlertSubscription } from '../models/AlertSubscription.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { severity, type, region, from, to, limit = 100, page = 1, sort = 'recent' } = req.query
    const filter = { status: { $ne: 'deleted' } }

    if (severity) filter.severity = parseInt(severity)
    if (type) filter.event_type = type
    if (region) { filter['location.continent'] = { $regex: region, $options: 'i' } }
    if (from || to) {
      filter.created_at = {}
      if (from) filter.created_at.$gte = new Date(from)
      if (to) filter.created_at.$lte = new Date(to)
    }

    const sortOpts = sort === 'recent' ? { created_at: -1 } : { severity: -1, created_at: -1 }
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [incidents, total] = await Promise.all([
      Incident.find(filter).sort(sortOpts).skip(skip).limit(parseInt(limit)).lean(),
      Incident.countDocuments(filter),
    ])

    res.json({ incidents, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    next(err)
  }
})

router.get('/geojson', async (req, res, next) => {
  try {
    const { severity, type, region, from, to } = req.query
    const filter = { status: { $ne: 'deleted' }, 'location.lat': { $ne: null }, 'location.lng': { $ne: null } }

    if (severity) filter.severity = parseInt(severity)
    if (type) filter.event_type = type
    if (region) filter['location.continent'] = { $regex: region, $options: 'i' }
    if (from || to) {
      filter.created_at = {}
      if (from) filter.created_at.$gte = new Date(from)
      if (to) filter.created_at.$lte = new Date(to)
    }

    const incidents = await Incident.find(filter)
      .sort({ created_at: -1 })
      .limit(parseInt(process.env.MAX_GEOJSON_INCIDENTS || '500'))
      .lean()

    const features = incidents.map((inc) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [inc.location.lng, inc.location.lat] },
      properties: {
        id: inc._id,
        event_type: inc.event_type,
        severity: inc.severity,
        severity_label: inc.severity_label,
        location_name: inc.location.name,
        continent: inc.location.continent,
        summary: inc.summary,
        status: inc.status,
        created_at: inc.created_at,
      },
    }))

    res.json({
      type: 'FeatureCollection',
      features,
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('sources')
      .lean()
    if (!incident || incident.status === 'deleted') {
      return res.status(404).json({ error: 'Incident not found' })
    }
    res.json(incident)
  } catch (err) {
    next(err)
  }
})

router.get('/:id/related', async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id).lean()
    if (!incident) return res.status(404).json({ error: 'Incident not found' })

    const radiusKm = parseFloat(req.query.radius_km || '500')
    const degrees = radiusKm / 111

    const related = await Incident.find({
      _id: { $ne: incident._id },
      'location.lat': { $gte: incident.location.lat - degrees, $lte: incident.location.lat + degrees },
      'location.lng': { $gte: incident.location.lng - degrees, $lte: incident.location.lng + degrees },
      created_at: { $gte: new Date(Date.now() - 7 * 86400000) },
      status: { $ne: 'deleted' },
    })
      .sort({ severity: -1 })
      .limit(5)
      .lean()

    res.json(related)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/alerts', async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const incident = await Incident.findById(req.params.id)
    if (!incident) return res.status(404).json({ error: 'Incident not found' })

    let sub = await AlertSubscription.findOne({ email })
    if (!sub) {
      sub = await AlertSubscription.create({
        email,
        token: req.headers['x-forwarded-for'] || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        rules: [{
          region: incident.location.country || 'worldwide',
          event_types: [incident.event_type],
          min_severity: incident.severity,
        }],
        confirmed: true,
      })
    }

    res.json({ message: 'Alert subscription updated', token: sub.token })
  } catch (err) {
    next(err)
  }
})

export default router

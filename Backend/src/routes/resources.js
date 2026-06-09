import { Router } from 'express'
import { Resource } from '../models/Resource.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { type, status, limit = 100 } = req.query
    const filter = {}
    if (type) filter.type = type
    if (status) filter.status = status

    const resources = await Resource.find(filter)
      .sort({ last_updated: -1 })
      .limit(parseInt(limit))
      .lean()

    res.json(resources)
  } catch (err) {
    next(err)
  }
})

router.get('/near', async (req, res, next) => {
  try {
    const { lng, lat, max_distance = 50000, type } = req.query
    if (!lng || !lat) return res.status(400).json({ error: 'lng and lat required' })

    const filter = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(max_distance),
        },
      },
    }
    if (type) filter.type = type

    const resources = await Resource.find(filter).limit(50).lean()
    res.json(resources)
  } catch (err) {
    next(err)
  }
})

router.get('/counts', async (req, res, next) => {
  try {
    const counts = await Resource.aggregate([
      { $group: { _id: { type: '$type', status: '$status' }, count: { $sum: 1 } } },
    ])
    const result = {}
    for (const entry of counts) {
      const type = entry._id.type
      if (!result[type]) result[type] = { total: 0 }
      result[type][entry._id.status] = entry.count
      result[type].total = (result[type].total || 0) + entry.count
    }
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).lean()
    if (!resource) return res.status(404).json({ error: 'Resource not found' })
    res.json(resource)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { type, name, status, lng, lat, details, traccar_id } = req.body
    if (!type || !name || lng === undefined || lat === undefined) {
      return res.status(400).json({ error: 'type, name, lng, lat required' })
    }

    const resource = await Resource.create({
      type,
      name,
      status: status || 'available',
      location: { type: 'Point', coordinates: [lng, lat] },
      details,
      traccar_id,
    })
    res.status(201).json(resource)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const updates = {}
    if (req.body.status) updates.status = req.body.status
    if (req.body.name) updates.name = req.body.name
    if (req.body.lng !== undefined && req.body.lat !== undefined) {
      updates.location = { type: 'Point', coordinates: [req.body.lng, req.body.lat] }
    }
    if (req.body.details) updates.details = { ...req.body.details }
    updates.last_updated = new Date()

    const resource = await Resource.findByIdAndUpdate(req.params.id, updates, { new: true }).lean()
    if (!resource) return res.status(404).json({ error: 'Resource not found' })
    res.json(resource)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id)
    if (!resource) return res.status(404).json({ error: 'Resource not found' })
    res.json({ message: 'Resource deleted' })
  } catch (err) {
    next(err)
  }
})

export default router

import { Router } from 'express'
import { Incident } from '../models/Incident.js'

const router = Router()

router.get('/summary', async (req, res, next) => {
  try {
    const [
      active, total, today, critical, countries,
    ] = await Promise.all([
      Incident.countDocuments({ status: 'active' }),
      Incident.countDocuments({ status: { $ne: 'deleted' } }),
      Incident.countDocuments({
        status: { $ne: 'deleted' },
        created_at: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Incident.countDocuments({ severity: { $gte: 4 }, status: 'active' }),
      Incident.distinct('location.country', { status: 'active' }),
    ])

    const mostActiveRegion = await Incident.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location.continent', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ])

    const mostCommonType = await Incident.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$event_type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ])

    res.json({
      active,
      total,
      today,
      countries: countries.length,
      critical,
      most_active_region: mostActiveRegion[0]?._id || 'Unknown',
      most_common_type: mostCommonType[0]?._id || 'Unknown',
    })
  } catch (err) {
    next(err)
  }
})

router.get('/by-type', async (req, res, next) => {
  try {
    const { from, to } = req.query
    const match = { status: { $ne: 'deleted' } }
    if (from || to) {
      match.created_at = {}
      if (from) match.created_at.$gte = new Date(from)
      if (to) match.created_at.$lte = new Date(to)
    }

    const counts = await Incident.aggregate([
      { $match: match },
      { $group: { _id: '$event_type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    res.json(counts.map((c) => ({ event_type: c._id, count: c.count })))
  } catch (err) {
    next(err)
  }
})

export default router

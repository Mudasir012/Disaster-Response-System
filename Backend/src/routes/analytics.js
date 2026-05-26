import { Router } from 'express'
import { Incident } from '../models/Incident.js'

const router = Router()

router.get('/summary', async (req, res, next) => {
  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [activeCount, todayCount, criticalCount, countries, total, byType, byRegion] = await Promise.all([
      Incident.countDocuments({ status: 'active' }),
      Incident.countDocuments({ created_at: { $gte: todayStart } }),
      Incident.countDocuments({ severity: 5, status: 'active' }),
      Incident.distinct('location.continent', { status: 'active' }),
      Incident.countDocuments({ status: { $ne: 'deleted' } }),
      Incident.aggregate([
        { $match: { status: { $ne: 'deleted' } } },
        { $group: { _id: '$event_type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
      Incident.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$location.continent', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
    ])

    res.json({
      active: activeCount,
      active_count: activeCount,
      today: todayCount,
      today_count: todayCount,
      countries_affected: countries.length,
      countries: countries.length,
      critical: criticalCount,
      critical_count: criticalCount,
      total: total,
      total_all_time: total,
      most_common_type: byType[0]?._id || null,
      most_active_region: byRegion[0]?._id || null,
    })
  } catch (err) {
    next(err)
  }
})

router.get('/over-time', async (req, res, next) => {
  try {
    const { range = '30d', type } = req.query

    const rangeDays = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }
    const days = rangeDays[range] || 30

    const since = new Date(Date.now() - days * 86400000)
    const filter = { created_at: { $gte: since }, status: { $ne: 'deleted' } }
    if (type) filter.event_type = type

    const results = await Incident.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ])

    res.json(results)
  } catch (err) {
    next(err)
  }
})

router.get('/by-type', async (req, res, next) => {
  try {
    const { from, to } = req.query
    const filter = { status: { $ne: 'deleted' } }
    if (from || to) {
      filter.created_at = {}
      if (from) filter.created_at.$gte = new Date(from)
      if (to) filter.created_at.$lte = new Date(to)
    }

    const results = await Incident.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$event_type',
          count: { $sum: 1 },
          avg_severity: { $avg: '$severity' },
        },
      },
      { $sort: { count: -1 } },
      { $project: { event_type: '$_id', count: 1, avg_severity: { $round: ['$avg_severity', 1] }, _id: 0 } },
    ])

    res.json(results)
  } catch (err) {
    next(err)
  }
})

router.get('/by-region', async (req, res, next) => {
  try {
    const { from, to } = req.query
    const filter = { status: { $ne: 'deleted' } }
    if (from || to) {
      filter.created_at = {}
      if (from) filter.created_at.$gte = new Date(from)
      if (to) filter.created_at.$lte = new Date(to)
    }

    const results = await Incident.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { continent: '$location.continent', country: '$location.country' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          continent: '$_id.continent',
          country: '$_id.country',
          count: 1,
          _id: 0,
        },
      },
    ])

    res.json(results)
  } catch (err) {
    next(err)
  }
})

router.get('/severity-distribution', async (req, res, next) => {
  try {
    const results = await Incident.aggregate([
      { $match: { status: { $ne: 'deleted' } } },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { severity: '$_id', count: 1, _id: 0 } },
    ])
    res.json(results)
  } catch (err) {
    next(err)
  }
})

export default router

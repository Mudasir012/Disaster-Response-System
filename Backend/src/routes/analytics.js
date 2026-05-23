import { Router } from 'express'
import { Incident } from '../models/Incident.js'

const router = Router()

router.get('/over-time', async (req, res, next) => {
  try {
    const { range = '30d', type } = req.query
    const days = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[range] || 30
    const since = new Date(Date.now() - 86400000 * days)

    const match = { created_at: { $gte: since }, status: { $ne: 'deleted' } }
    if (type) match.event_type = type

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
          earthquake: { $sum: { $cond: [{ $eq: ['$event_type', 'earthquake'] }, 1, 0] } },
          flood: { $sum: { $cond: [{ $eq: ['$event_type', 'flood'] }, 1, 0] } },
          wildfire: { $sum: { $cond: [{ $eq: ['$event_type', 'wildfire'] }, 1, 0] } },
          cyclone: { $sum: { $cond: [{ $eq: ['$event_type', 'cyclone'] }, 1, 0] } },
          tsunami: { $sum: { $cond: [{ $eq: ['$event_type', 'tsunami'] }, 1, 0] } },
          severe_weather: { $sum: { $cond: [{ $eq: ['$event_type', 'severe_weather'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]

    const results = await Incident.aggregate(pipeline)

    const dateMap = {}
    results.forEach((r) => { dateMap[r._id] = r })

    const allDates = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - 86400000 * i).toISOString().split('T')[0]
      allDates.push({
        date: d,
        earthquake: dateMap[d]?.earthquake || 0,
        flood: dateMap[d]?.flood || 0,
        wildfire: dateMap[d]?.wildfire || 0,
        cyclone: dateMap[d]?.cyclone || 0,
        tsunami: dateMap[d]?.tsunami || 0,
        severe_weather: dateMap[d]?.severe_weather || 0,
      })
    }

    res.json(allDates)
  } catch (err) {
    next(err)
  }
})

router.get('/by-region', async (req, res, next) => {
  try {
    const { from, to } = req.query
    const match = { status: { $ne: 'deleted' } }
    if (from || to) {
      match.created_at = {}
      if (from) match.created_at.$gte = new Date(from)
      if (to) match.created_at.$lte = new Date(to)
    }

    const pipeline = [
      { $match: match },
      { $group: { _id: '$location.continent', count: { $sum: 1 }, total_severity: { $sum: '$severity' } } },
      { $project: { region: '$_id', count: 1, avg_severity: { $round: [{ $divide: ['$total_severity', '$count'] }, 1] } } },
      { $sort: { count: -1 } },
    ]

    const results = await Incident.aggregate(pipeline)
    res.json(results.map((r) => ({ region: r.region || 'Unknown', count: r.count, avg_severity: r.avg_severity || 0 })))
  } catch (err) {
    next(err)
  }
})

export default router

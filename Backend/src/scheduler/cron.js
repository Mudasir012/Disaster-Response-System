import cron from 'node-cron'
import syncQueue from '../queues/syncQueue.js'
import { Incident } from '../models/Incident.js'
import { emitStatsUpdate } from '../socket.js'
import logger from '../utils/logger.js'

const sources = ['gdelt', 'usgs', 'gdacs', 'noaa']

function enqueueAll() {
  sources.forEach((source) => {
    syncQueue.add('sync', { source }, {
      jobId: `${source}-${Date.now()}`,
      removeOnComplete: { age: 3600 },
      removeOnFail: { age: 86400 },
    }).catch((err) => logger.error(`[Scheduler] Failed to enqueue ${source}:`, err.message))
  })

  logger.info(`[Scheduler] Enqueued sync jobs for: ${sources.join(', ')}`)
}

async function emitStats() {
  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [active, today, critical, countries] = await Promise.all([
      Incident.countDocuments({ status: 'active' }),
      Incident.countDocuments({ created_at: { $gte: todayStart } }),
      Incident.countDocuments({ severity: 5, status: 'active' }),
      Incident.distinct('location.continent', { status: 'active' }),
    ])

    emitStatsUpdate({ active, today, critical, countries: countries.length })
  } catch (err) {
    logger.error('[Scheduler] Stats emit error:', err.message)
  }
}

export default function startScheduler() {
  logger.info('[Scheduler] Starting cron (every 15 min for sync, every 60s for stats)')

  cron.schedule('*/15 * * * *', () => {
    enqueueAll()
  })

  cron.schedule('* * * * *', () => {
    emitStats()
  })

  enqueueAll()

  setTimeout(() => emitStats(), 5000)
}

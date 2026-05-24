import cron from 'node-cron'
import { queues } from '../queue.js'
import { config } from '../../config/index.js'

export function startScheduler() {
  console.log('[Scheduler] Starting sync scheduler (interval: 2 min, GDELT: 15 min)')

  cron.schedule('*/2 * * * *', () => {
    enqueueSyncs(['gdacs', 'usgs', 'noaa', 'newsapi'])
  })

  cron.schedule('*/15 * * * *', () => {
    enqueueSyncs(['gdelt'])
  })

  enqueueSyncs(['gdacs', 'usgs', 'noaa', 'newsapi'])
  enqueueSyncs(['gdelt'])
}

function enqueueSyncs(names) {
  names.forEach((name) => {
    const queue = queues[name]
    if (!queue) return
    queue.add('sync', { source: name }, {
      removeOnComplete: { age: 3600 },
      removeOnFail: { age: 86400 },
    }).catch((err) => console.error(`[Scheduler] Failed to enqueue ${name}:`, err.message))
  })
}

export async function triggerSync(source) {
  const queue = queues[source]
  if (!queue) throw new Error(`Unknown source: ${source}`)
  await queue.add('sync', { source }, {
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  })
  console.log(`[Sync] Manual sync triggered for ${source}`)
}

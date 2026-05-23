import cron from 'node-cron'
import { queues } from '../queue.js'
import { config } from '../../config/index.js'

export function startScheduler() {
  console.log('[Scheduler] Starting sync scheduler (interval: 2 min)')

  cron.schedule('*/2 * * * *', () => {
    enqueueAllSyncs()
  })

  enqueueAllSyncs()
}

function enqueueAllSyncs() {
  const sources = [
    { name: 'gdacs', queue: queues.gdacs },
    { name: 'usgs', queue: queues.usgs },
    { name: 'noaa', queue: queues.noaa },
    { name: 'newsapi', queue: queues.newsapi },
  ]

  sources.forEach(({ name, queue }) => {
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

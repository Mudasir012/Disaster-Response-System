import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'
import { config } from '../config/index.js'

const connection = new Redis(config.redisUrl, { maxRetriesPerRequest: null })

export const queues = {
  gdacs: new Queue('gdacs', { connection }),
  usgs: new Queue('usgs', { connection }),
  noaa: new Queue('noaa', { connection }),
  newsapi: new Queue('newsapi', { connection }),
  twitter: new Queue('twitter', { connection }),
}

export { connection }

export async function getQueueStats() {
  const results = await Promise.all(
    Object.entries(queues).map(async ([name, queue]) => {
      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
      ])
      return { name: `${name} queue`, waiting, active, completed, failed }
    })
  )
  return results
}

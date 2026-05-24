import { Worker } from 'bullmq'
import redis from '../config/redis.js'
import syncQueue from '../queues/syncQueue.js'
import alertQueue from '../queues/alertQueue.js'
import processSyncJob from '../processors/syncProcessor.js'
import processAlertJob from '../processors/alertProcessor.js'
import logger from '../utils/logger.js'

export default function startWorkers() {
  const syncWorker = new Worker('disaster-sync', processSyncJob, {
    connection: redis,
    concurrency: 3,
  })

  syncWorker.on('completed', (job) => {
    logger.info(`Sync job ${job.id} (${job.data.source}) completed`)
  })
  syncWorker.on('failed', (job, err) => {
    logger.error(`Sync job ${job?.id} failed: ${err.message}`)
  })

  const alertWorker = new Worker('alert-emails', processAlertJob, {
    connection: redis,
    concurrency: 2,
  })

  alertWorker.on('completed', (job) => {
    logger.info(`Alert email job ${job.id} sent`)
  })
  alertWorker.on('failed', (job, err) => {
    logger.error(`Alert email job ${job?.id} failed: ${err.message}`)
  })

  logger.info('BullMQ workers started')
}

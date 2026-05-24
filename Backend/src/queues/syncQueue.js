import { Queue } from 'bullmq'
import redis from '../config/redis.js'

const syncQueue = new Queue('disaster-sync', { connection: redis })

export default syncQueue

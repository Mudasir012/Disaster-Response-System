import { Queue } from 'bullmq'
import redis from '../config/redis.js'

const alertQueue = new Queue('alert-emails', { connection: redis })

export default alertQueue

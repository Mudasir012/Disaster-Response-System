import 'dotenv/config'
import http from 'http'
import app from './app.js'
import { initSocket } from './socket.js'
import connectDB from './config/db.js'
import startWorkers from './workers/index.js'
import startScheduler from './scheduler/cron.js'
import logger from './utils/logger.js'

const PORT = process.env.PORT || 3001

async function start() {
  await connectDB()

  const server = http.createServer(app)

  initSocket(server)

  startWorkers()

  startScheduler()

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

start().catch((err) => {
  logger.error('Failed to start server:', err)
  process.exit(1)
})

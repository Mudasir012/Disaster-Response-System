import http from 'http'
import { Server } from 'socket.io'
import { createApp } from './app.js'
import { connectDB } from './db/mongoose.js'
import { config } from './config/index.js'
import { setupSocket } from './socket/index.js'
import { startScheduler } from './services/sync/scheduler.js'
import { startWorkers, setSocketIO } from './services/sync/processor.js'

async function main() {
  await connectDB()

  const app = createApp()
  const server = http.createServer(app)

  const io = new Server(server, {
    cors: {
      origin: config.frontendUrl,
      methods: ['GET', 'POST'],
    },
  })

  app.set('io', io)
  setupSocket(io)
  setSocketIO(io)

  if (config.nodeEnv === 'production' || process.argv.includes('--sync')) {
    startScheduler()
    startWorkers()
  }

  server.listen(config.port, () => {
    console.log(`[Server] Running on port ${config.port} in ${config.nodeEnv} mode`)
    console.log(`[Server] API: http://localhost:${config.port}/api`)
    console.log(`[Server] Frontend: ${config.frontendUrl}`)
  })
}

main().catch((err) => {
  console.error('[Fatal]', err)
  process.exit(1)
})

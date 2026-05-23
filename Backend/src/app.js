import express from 'express'
import cors from 'cors'
import { config } from '../config/index.js'
import { errorHandler } from '../middleware/errorHandler.js'
import incidentRoutes from '../routes/incidents.js'
import statsRoutes from '../routes/stats.js'
import analyticsRoutes from '../routes/analytics.js'
import alertRoutes from '../routes/alerts.js'
import adminRoutes from '../routes/admin.js'
import healthRoutes from '../routes/health.js'

export function createApp() {
  const app = express()

  app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
  }))
  app.use(express.json())

  app.use('/api/incidents', incidentRoutes)
  app.use('/api/stats', statsRoutes)
  app.use('/api/analytics', analyticsRoutes)
  app.use('/api/alerts', alertRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api/health', healthRoutes)

  app.use(errorHandler)

  return app
}

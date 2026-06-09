import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { publicLimiter } from './middleware/rateLimiter.js'
import errorHandler from './middleware/errorHandler.js'
import incidentRoutes from './routes/incidents.js'
import analyticsRoutes from './routes/analytics.js'
import alertRoutes from './routes/alerts.js'
import chatRoutes from './routes/chat.js'
import adminRoutes from './routes/admin.js'
import healthRoutes from './routes/health.js'
import gdeltRoutes from './routes/gdelt.js'
import resourceRoutes from './routes/resources.js'
import traccarRoutes from './routes/traccar.js'
import routingRoutes from './routes/routing.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json())
app.use('/api', publicLimiter)

app.use('/api/incidents', incidentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/gdelt', gdeltRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/traccar', traccarRoutes)
app.use('/api/routing', routingRoutes)

app.get('/api/stats/summary', async (req, res) => {
  const { Incident } = await import('./models/Incident.js')
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [active, today, critical, countries] = await Promise.all([
    Incident.countDocuments({ status: 'active' }),
    Incident.countDocuments({ created_at: { $gte: todayStart } }),
    Incident.countDocuments({ severity: 5, status: 'active' }),
    Incident.distinct('location.continent', { status: 'active' }),
  ])

  res.json({ active, today, critical, countries: countries.length })
})

app.use(errorHandler)

export default app

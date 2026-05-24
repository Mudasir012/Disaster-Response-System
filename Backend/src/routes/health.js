import { Router } from 'express'
import mongoose from 'mongoose'
import { Incident } from '../models/Incident.js'
import { getConnectedClients } from '../socket.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const mongoState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    const lastIncident = await Incident.findOne().sort({ created_at: -1 }).select('created_at').lean()

    res.json({
      status: 'ok',
      mongodb: mongoState,
      socket_clients: getConnectedClients(),
      uptime_seconds: Math.floor(process.uptime()),
      last_incident_at: lastIncident?.created_at || null,
    })
  } catch (err) {
    next(err)
  }
})

export default router

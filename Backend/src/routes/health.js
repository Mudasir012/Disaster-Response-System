import { Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

router.get('/', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  const io = req.app.get('io')

  res.json({
    status: mongoStatus === 'connected' ? 'operational' : 'degraded',
    mongodb: mongoStatus,
    socketio: io ? `${io.sockets.sockets.size} connections` : 'not initialized',
    timestamp: new Date().toISOString(),
  })
})

export default router

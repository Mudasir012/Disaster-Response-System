import { Server } from 'socket.io'
import logger from './utils/logger.js'

let io = null
let connectedClients = 0

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    connectedClients++
    logger.info(`Socket client connected (${connectedClients} total)`)

    socket.on('subscribe_region', (region) => {
      socket.join(region)
    })

    socket.on('unsubscribe_region', (region) => {
      socket.leave(region)
    })

    socket.on('disconnect', () => {
      connectedClients--
      logger.info(`Socket client disconnected (${connectedClients} remaining)`)
    })
  })

  return io
}

export function emitNewIncident(incident) {
  if (io) io.emit('new_incident', incident)
}

export function emitSeverityEscalated(data) {
  if (io) io.emit('severity_escalated', data)
}

export function emitIncidentResolved(incidentId) {
  if (io) io.emit('incident_resolved', { incident_id: incidentId })
}

export function emitStatsUpdate(stats) {
  if (io) io.emit('stats_update', stats)
}

export function emitResourceUpdate(resource) {
  if (io) io.emit('resource_update', resource)
}

export function emitResourceDelete(resourceId) {
  if (io) io.emit('resource_delete', { resource_id: resourceId })
}

export function emitResourceCounts(counts) {
  if (io) io.emit('resource_counts', counts)
}

export function getConnectedClients() {
  return connectedClients
}

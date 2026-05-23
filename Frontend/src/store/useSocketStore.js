import { create } from 'zustand'
import { createSocket } from '../lib/socket'
import { useIncidentStore } from './useIncidentStore'

export const useSocketStore = create((set, get) => ({
  socket: null,
  connected: false,
  stats: { active: 0, today: 0, critical: 0, countries: 0 },

  connect: () => {
    const socket = createSocket()
    socket.on('connect', () => {
      set({ connected: true })
    })
    socket.on('disconnect', () => set({ connected: false }))
    socket.on('stats_update', (stats) => set({ stats }))
    socket.on('new_incident', (incident) => {
      useIncidentStore.getState().addIncident(incident)
    })
    socket.on('severity_escalated', ({ incident_id, new_severity }) => {
      useIncidentStore.getState().updateIncident(incident_id, { severity: new_severity })
    })
    socket.connect()
    set({ socket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, connected: false })
    }
  },
}))

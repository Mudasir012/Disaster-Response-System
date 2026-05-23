import { create } from 'zustand'
import { api } from '../lib/api'
import { mockIncidents, mockStatsSummary, mockStatsByType } from '../data/mockData'

const useMockData = !import.meta.env.VITE_API_URL

export const useIncidentStore = create((set, get) => ({
  incidents: [],
  activeIncident: null,
  statsSummary: null,
  statsByType: [],
  loading: false,
  error: null,

  fetchIncidents: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      if (useMockData) {
        let filtered = [...mockIncidents]
        if (params.type) filtered = filtered.filter(i => i.event_type === params.type)
        if (params.severity) {
          const [min, max] = params.severity.split('-').map(Number)
          filtered = filtered.filter(i => i.severity >= (min || 0) && i.severity <= (max || 5))
        }
        if (params.limit) filtered = filtered.slice(0, Number(params.limit))
        set({ incidents: filtered, loading: false })
        return filtered
      }
      const data = await api.incidents(params)
      set({ incidents: data, loading: false })
      return data
    } catch (err) {
      set({ error: err.message, loading: false })
      return []
    }
  },

  fetchIncident: async (id) => {
    set({ loading: true, error: null })
    try {
      if (useMockData) {
        const inc = mockIncidents.find(i => i._id === id) || mockIncidents[0]
        set({ activeIncident: inc, loading: false })
        return inc
      }
      const data = await api.incident(id)
      set({ activeIncident: data, loading: false })
      return data
    } catch (err) {
      set({ error: err.message, loading: false })
      return null
    }
  },

  fetchStatsSummary: async () => {
    try {
      if (useMockData) {
        set({ statsSummary: mockStatsSummary })
        return mockStatsSummary
      }
      const data = await api.statsSummary()
      set({ statsSummary: data })
      return data
    } catch {
      set({ statsSummary: mockStatsSummary })
    }
  },

  fetchStatsByType: async (params = {}) => {
    try {
      if (useMockData) {
        set({ statsByType: mockStatsByType })
        return mockStatsByType
      }
      const data = await api.statsByType(params)
      set({ statsByType: data })
      return data
    } catch {
      set({ statsByType: mockStatsByType })
    }
  },

  addIncident: (incident) => {
    set((state) => ({
      incidents: [incident, ...state.incidents],
    }))
  },

  updateIncident: (id, updates) => {
    set((state) => ({
      incidents: state.incidents.map((i) => (i._id === id ? { ...i, ...updates } : i)),
      activeIncident:
        state.activeIncident?._id === id
          ? { ...state.activeIncident, ...updates }
          : state.activeIncident,
    }))
  },

  resetActiveIncident: () => set({ activeIncident: null }),
}))

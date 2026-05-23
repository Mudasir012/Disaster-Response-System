import { create } from 'zustand'

export const useFilterStore = create((set) => ({
  types: [],
  severityMin: 1,
  severityMax: 5,
  timeRange: '24h',
  region: 'worldwide',
  search: '',
  sidebarOpen: true,

  setTypes: (types) => set({ types }),
  toggleType: (type) =>
    set((state) => ({
      types: state.types.includes(type)
        ? state.types.filter((t) => t !== type)
        : [...state.types, type],
    })),
  setSeverityMin: (severityMin) => set({ severityMin }),
  setSeverityMax: (severityMax) => set({ severityMax }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setRegion: (region) => set({ region }),
  setSearch: (search) => set({ search }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  resetFilters: () =>
    set({
      types: [],
      severityMin: 1,
      severityMax: 5,
      timeRange: '24h',
      region: 'worldwide',
      search: '',
    }),
}))

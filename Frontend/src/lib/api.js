const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `API error: ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Incidents
  incidents: (params) => {
    const q = new URLSearchParams(params).toString()
    return request(`/incidents${q ? `?${q}` : ''}`)
  },
  incident: (id) => request(`/incidents/${id}`),
  incidentsGeoJSON: (params) => {
    const q = new URLSearchParams(params).toString()
    return request(`/incidents/geojson${q ? `?${q}` : ''}`)
  },
  relatedIncidents: (id, radius = 500) =>
    request(`/incidents/${id}/related?radius_km=${radius}`),

  // Stats
  statsSummary: () => request('/stats/summary'),
  statsByType: (params) => {
    const q = new URLSearchParams(params).toString()
    return request(`/analytics/by-type${q ? `?${q}` : ''}`)
  },
  severityDistribution: () => request('/analytics/severity-distribution'),

  // Analytics
  analyticsOverTime: (range = '30d', type) => {
    const q = new URLSearchParams({ range, ...(type && { type }) }).toString()
    return request(`/analytics/over-time?${q}`)
  },
  analyticsByRegion: (params) => {
    const q = new URLSearchParams(params).toString()
    return request(`/analytics/by-region${q ? `?${q}` : ''}`)
  },

  // Alerts
  subscribeAlerts: (data) =>
    request('/alerts/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  getAlerts: (token) => request(`/alerts/${token}`),
  updateAlerts: (token, data) =>
    request(`/alerts/${token}`, { method: 'PATCH', body: JSON.stringify(data) }),
  testAlert: (token, ruleIndex) =>
    request(`/alerts/${token}/test`, { method: 'POST', body: JSON.stringify({ rule_index: ruleIndex }) }),
  unsubscribeAlerts: (token) =>
    request(`/alerts/${token}`, { method: 'DELETE' }),

  // Admin
  adminLogin: (data) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify(data) }),
  adminHealth: () => request('/admin/health'),
  adminQueues: () => request('/admin/queues'),
  adminSync: (source) =>
    request(`/admin/sync/${source}`, { method: 'POST' }),
  adminRetryQueue: (queue) =>
    request(`/admin/queues/${queue}/retry`, { method: 'POST' }),
  adminAILog: (params) => {
    const q = new URLSearchParams(params).toString()
    return request(`/admin/ai-log${q ? `?${q}` : ''}`)
  },
  adminUpdateIncident: (id, data) =>
    request(`/admin/incidents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminDeleteIncident: (id) =>
    request(`/admin/incidents/${id}`, { method: 'DELETE' }),
  adminReprocessIncident: (id) =>
    request(`/admin/incidents/${id}/reprocess`, { method: 'POST' }),

  // Health
  health: () => request('/health'),
}

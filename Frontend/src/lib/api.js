const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function getAdminToken() {
  return document.cookie.match(/admin_token=([^;]+)/)?.[1] || ''
}

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || err.error || `API error: ${res.status}`)
  }
  return res.json()
}

async function adminRequest(url, options = {}) {
  return request(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`,
      ...options.headers,
    },
  })
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
  analyticsOverview: () => request('/analytics/summary'),
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
  confirmAlert: (token) =>
    request(`/alerts/${token}/confirm`, { method: 'POST' }),
  testAlert: (token, ruleIndex) =>
    request(`/alerts/${token}/test`, { method: 'POST', body: JSON.stringify({ rule_index: ruleIndex }) }),
  unsubscribeAlerts: (token) =>
    request(`/alerts/${token}`, { method: 'DELETE' }),

  // Chat
  chat: (message) =>
    request('/chat', { method: 'POST', body: JSON.stringify({ message }) }),

  // Admin

  adminLogin: (data) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify(data) }),
  adminHealth: () => adminRequest('/admin/health'),
  adminQueues: () => adminRequest('/admin/queues'),
  adminSync: (source) =>
    adminRequest(`/admin/sync/${source}`, { method: 'POST' }),
  adminRetryQueue: (queue) =>
    adminRequest(`/admin/queues/${queue}/retry`, { method: 'POST' }),
  adminAILog: (params) => {
    const q = new URLSearchParams(params).toString()
    return adminRequest(`/admin/ai-log${q ? `?${q}` : ''}`)
  },
  adminUpdateIncident: (id, data) =>
    adminRequest(`/admin/incidents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adminDeleteIncident: (id) =>
    adminRequest(`/admin/incidents/${id}`, { method: 'DELETE' }),
  adminReprocessIncident: (id) =>
    adminRequest(`/admin/incidents/${id}/reprocess`, { method: 'POST' }),

  // GDELT Feed
  gdeltFeed: (location) => {
    const q = location ? `?location=${encodeURIComponent(location)}` : ''
    return request(`/gdelt/feed${q}`)
  },
  gdeltCities: (query) => request(`/gdelt/cities?q=${encodeURIComponent(query)}`),
  gdeltCountries: (query) => request(`/gdelt/countries?q=${encodeURIComponent(query)}`),

  // Resources
  resources: (params) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/resources${q}`)
  },
  resource: (id) => request(`/resources/${id}`),
  createResource: (data) =>
    request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  updateResource: (id, data) =>
    request(`/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteResource: (id) =>
    request(`/resources/${id}`, { method: 'DELETE' }),
  resourcesNear: (params) => {
    const q = new URLSearchParams(params).toString()
    return request(`/resources/near?${q}`)
  },
  resourceCounts: () => request('/resources/counts'),

  // Routing (ORS)
  routingDirections: (data) =>
    request('/routing/directions', { method: 'POST', body: JSON.stringify(data) }),
  routingIsochrones: (data) =>
    request('/routing/isochrones', { method: 'POST', body: JSON.stringify(data) }),

  // Traccar
  traccarDevices: () => request('/traccar/devices'),
  traccarPositions: (deviceId) => {
    const q = deviceId ? `?deviceId=${deviceId}` : ''
    return request(`/traccar/positions${q}`)
  },

  // Contact
  contact: (data) =>
    request('/contact', { method: 'POST', body: JSON.stringify(data) }),

  // Health
  health: () => request('/health'),
}

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from './DashboardLayout'
import MapView from './MapView'
import SidebarPanel from './SidebarPanel'
import WatchRegionPanel from './WatchRegionPanel'
import ChatWidget from './ChatWidget'
import { api } from '../lib/api'
import { createSocket } from '../lib/socket'
import { mapBackendIncidentToFrontend } from '../utils/mapper'

export default function Dashboard() {
  const [incidents, setIncidents] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [showRegions, setShowRegions] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)

  const fetchIncidents = useCallback(async (country) => {
    try {
      setLoading(true)
      setError(null)
      const params = { limit: 100 }
      if (country) params.country = country
      const data = await api.incidents(params)
      const mapped = (data.incidents || []).map(mapBackendIncidentToFrontend)
      setIncidents(mapped)
    } catch {
      setError('Unable to load incidents. Retrying automatically.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIncidents(selectedCountry)
  }, [selectedCountry, fetchIncidents])

  useEffect(() => {
    const socket = createSocket()
    socket.connect()

    socket.on('new_incident', (inc) => {
      const mapped = mapBackendIncidentToFrontend(inc)
      setIncidents((prev) => {
        if (prev.some((p) => p.id === mapped.id)) return prev
        return [mapped, ...prev]
      })
    })

    socket.on('severity_escalated', ({ incident_id, severity }) => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === incident_id) {
            let severityKey = 'info'
            if (severity === 5) severityKey = 'critical'
            else if (severity === 4) severityKey = 'severe'
            else if (severity === 3) severityKey = 'moderate'
            return { ...inc, severity: severityKey }
          }
          return inc
        })
      )
    })

    socket.on('incident_resolved', ({ incident_id }) => {
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === incident_id ? { ...inc, status: 'resolved' } : inc))
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleCountryChange = (country) => {
    setSelectedCountry(country)
  }

  return (
    <DashboardLayout
      onWatchRegions={() => setShowRegions(true)}
      selectedCountry={selectedCountry}
      onClearCountry={() => handleCountryChange(null)}
    >
      <h1 className="sr-only">Dashboard</h1>

      <div className="absolute inset-0 z-0">
        <MapView
          incidents={incidents}
          selectedId={selectedId}
          onSelect={setSelectedId}
          loading={loading}
        />
      </div>

      <div className="absolute top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.1,1)] overflow-hidden"
        style={{ width: chatOpen ? '380px' : '0px' }}
      >
        <div className="w-[380px] h-full">
          <ChatWidget onClose={() => setChatOpen(false)} />
        </div>
      </div>

      <button
        onClick={() => setChatOpen((prev) => !prev)}
        className="fixed top-1/2 left-0 -translate-y-1/2 z-40 w-8 h-16 rounded-r-[2px] bg-ink flex items-center justify-center transition-all duration-300 hover:w-9 hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] active:scale-95 cursor-pointer"
        style={{ left: chatOpen ? '380px' : '0px' }}
        aria-label={chatOpen ? 'Close AI assistant' : 'Open AI assistant'}
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300"
          style={{ transform: chatOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {error && (
        <div className="absolute bottom-4 left-4 right-4 z-40 max-w-md mx-auto bg-amber/15 border border-amber/20 px-4 py-2.5">
          <p className="text-xs text-amber/80 text-center">{error}</p>
        </div>
      )}

      <div className="absolute top-0 right-0 bottom-0 w-[400px] lg:w-[460px] z-20">
        <SidebarPanel
          incidents={incidents}
          selectedId={selectedId}
          onSelect={setSelectedId}
          loading={loading}
        />
      </div>

      <WatchRegionPanel
        open={showRegions}
        onClose={() => setShowRegions(false)}
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
      />
    </DashboardLayout>
  )
}

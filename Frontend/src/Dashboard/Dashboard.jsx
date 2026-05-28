import { useState, useEffect } from 'react'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchIncidents() {
      try {
        setLoading(true)
        const data = await api.incidents({ limit: 100 })
        if (active) {
          const mapped = (data.incidents || []).map(mapBackendIncidentToFrontend)
          setIncidents(mapped)
        }
      } catch (err) {
        console.error('Failed to fetch real-time incidents:', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchIncidents()

    const socket = createSocket()
    socket.connect()

    socket.on('new_incident', (inc) => {
      if (active) {
        const mapped = mapBackendIncidentToFrontend(inc)
        setIncidents((prev) => {
          if (prev.some((p) => p.id === mapped.id)) return prev
          return [mapped, ...prev]
        })
      }
    })

    socket.on('severity_escalated', ({ incident_id, severity }) => {
      if (active) {
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
      }
    })

    socket.on('incident_resolved', ({ incident_id }) => {
      if (active) {
        setIncidents((prev) =>
          prev.map((inc) => (inc.id === incident_id ? { ...inc, status: 'resolved' } : inc))
        )
      }
    })

    return () => {
      active = false
      socket.disconnect()
    }
  }, [])

  return (
    <DashboardLayout onWatchRegions={() => setShowRegions(true)}>
      <h1 className="sr-only">Dashboard</h1>
      <div className="absolute inset-0 top-14">
        <MapView
          incidents={incidents}
          selectedId={selectedId}
          onSelect={setSelectedId}
          loading={loading}
        />
      </div>
      <div className="absolute top-14 right-0 bottom-0 w-[400px] lg:w-[460px] z-10">
        <SidebarPanel
          incidents={incidents}
          selectedId={selectedId}
          onSelect={setSelectedId}
          loading={loading}
        />
      </div>

      <WatchRegionPanel open={showRegions} onClose={() => setShowRegions(false)} />
      <ChatWidget />
    </DashboardLayout>
  )
}


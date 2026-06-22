import { useState, useEffect, useCallback, useRef } from 'react'
import { createSocket } from '../lib/socket'
import { api } from '../lib/api'
import DashboardLayout from '../Dashboard/DashboardLayout'
import ResourceMap from './ResourceMap'
import ResourceSidebar from './ResourceSidebar'
import AddResourceModal from './AddResourceModal'

const TYPE_COLORS = {
  vehicle: '#3b82f6',
  ambulance: '#ef4444',
  personnel: '#22c55e',
  shelter: '#f59e0b',
  supply_point: '#8b5cf6',
  medical_post: '#ec4899',
}

const STATUS_COLORS = {
  available: '#22c55e',
  busy: '#f59e0b',
  critical: '#ef4444',
}

export default function ResourceTracking() {
  const [resources, setResources] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [route, setRoute] = useState(null)
  const [isochrones, setIsochrones] = useState([])
  const [placing, setPlacing] = useState(false)
  const [modalPos, setModalPos] = useState(null)
  const sidebarRef = useRef(null)

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.resources()
      setResources(Array.isArray(data) ? data : [])
    } catch {
      setResources([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  useEffect(() => {
    const socket = createSocket()
    socket.connect()

    socket.on('resource_update', (res) => {
      setResources((prev) => {
        const idx = prev.findIndex((r) => r._id === res._id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = { ...next[idx], ...res }
          return next
        }
        return [res, ...prev]
      })
    })

    socket.on('resource_delete', ({ resource_id }) => {
      setResources((prev) => prev.filter((r) => r._id !== resource_id))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handlePlace = useCallback((lng, lat) => {
    setModalPos({ lng, lat })
    setPlacing(false)
  }, [])

  const handleSave = useCallback(async (data) => {
    await api.createResource(data)
    await fetchResources()
  }, [fetchResources])

  const handleRoute = useCallback(async (from, to) => {
    try {
      const data = await api.routingDirections({
        coordinates: [[from.lng, from.lat], [to.lng, to.lat]],
        profile: 'driving-car',
      })
      setRoute(data)
    } catch {
      setRoute(null)
    }
  }, [])

  const handleIsochrone = useCallback(async (lng, lat, ranges = [5000, 10000, 30000]) => {
    try {
      const data = await api.routingIsochrones({
        location: [lng, lat],
        range: ranges,
        profile: 'driving-car',
      })
      setIsochrones(data.features || [])
    } catch {
      setIsochrones([])
    }
  }, [])

  const clearOverlays = useCallback(() => {
    setRoute(null)
    setIsochrones([])
  }, [])

  const filtered = filter === 'all'
    ? resources
    : resources.filter((r) => r.type === filter)

  return (
    <DashboardLayout>
      <div className="flex-1 w-full bg-landing-bg relative overflow-hidden">
        <ResourceMap
          resources={filtered}
          selected={selected}
          onSelect={setSelected}
          route={route}
          isochrones={isochrones}
          onRoute={handleRoute}
          onIsochrone={handleIsochrone}
          clearOverlays={clearOverlays}
          TYPE_COLORS={TYPE_COLORS}
          STATUS_COLORS={STATUS_COLORS}
          onRefresh={fetchResources}
          sidebarRef={sidebarRef}
          placing={placing}
          onPlace={handlePlace}
        />

        <div className="absolute top-0 right-0 bottom-0 w-[380px] lg:w-[420px] z-20 pointer-events-none">
          <div className="w-full h-full pointer-events-auto" ref={sidebarRef}>
            <ResourceSidebar
              resources={resources}
              filter={filter}
              onFilter={setFilter}
              selected={selected}
              onSelect={setSelected}
              loading={loading}
              onRefresh={fetchResources}
              TYPE_COLORS={TYPE_COLORS}
              STATUS_COLORS={STATUS_COLORS}
              route={route}
              isochrones={isochrones}
              clearOverlays={clearOverlays}
              onRoute={handleRoute}
              onIsochrone={handleIsochrone}
              onAddClick={() => setPlacing(true)}
              placing={placing}
            />
          </div>
        </div>

        {/* Floating Add button */}
        {!placing && (
          <button
            onClick={() => setPlacing(true)}
            className="absolute bottom-6 left-6 z-30 w-11 h-11 rounded-full bg-purple-500/80 hover:bg-purple-500
              text-on-accent flex items-center justify-center shadow-lg
              transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Add resource — click on map to place"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}

        {modalPos && (
          <AddResourceModal
            position={modalPos}
            onClose={() => { setModalPos(null); clearOverlays() }}
            onSave={handleSave}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { createSocket } from '../lib/socket'
import { api } from '../lib/api'
import ResourceMap from './ResourceMap'
import ResourceSidebar from './ResourceSidebar'

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

  const handleRoute = async (from, to) => {
    try {
      const data = await api.routingDirections({
        coordinates: [[from.lng, from.lat], [to.lng, to.lat]],
        profile: 'driving-car',
      })
      setRoute(data)
    } catch {
      setRoute(null)
    }
  }

  const handleIsochrone = async (lng, lat, ranges = [5000, 10000, 30000]) => {
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
  }

  const clearOverlays = () => {
    setRoute(null)
    setIsochrones([])
  }

  const filtered = filter === 'all'
    ? resources
    : resources.filter((r) => r.type === filter)

  return (
    <div className="h-[100dvh] w-full bg-[#05080f] relative overflow-hidden">
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
      />

      <div className="absolute top-0 right-0 bottom-0 w-[380px] lg:w-[420px] z-20 pointer-events-none">
        <div className="w-full h-full pointer-events-auto" ref={sidebarRef}>
          <ResourceSidebar
            resources={resources}
            counts={resources.reduce((acc, r) => {
              const t = r.type
              if (!acc[t]) acc[t] = []
              acc[t].push(r)
              return acc
            }, {})}
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
          />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { DISASTER_TYPES } from './constants'
import MapSkeleton from './MapSkeleton'

export default function MapView({ incidents, selectedId, onSelect, loading }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  })

  useEffect(() => {
    if (mapRef.current) return
    const container = containerRef.current
    if (!container) return

    const map = L.map(container, {
      center: [20, 20],
      zoom: 1.8,
      attributionControl: false,
      zoomControl: false,
    })

    L.tileLayer('https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      tileSize: 256,
      attribution: '&copy; CARTO',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !incidents) return

    const markers = markersRef.current
    const newIds = new Set()

    incidents.forEach((inc) => {
      if (inc.lat == null || inc.lng == null) return
      if (isNaN(inc.lat) || isNaN(inc.lng)) return
      newIds.add(inc.id)

      const type = inc.type || 'Earthquake'
      const color = DISASTER_TYPES[type]?.color || '#94a3b8'
      const isSelected = selectedId === inc.id

      if (markers[inc.id]) {
        const m = markers[inc.id]
        m.setLatLng([inc.lat, inc.lng])
        m.setStyle({
          fillColor: color,
          color: isSelected ? '#fff' : 'rgba(255,255,255,0.3)',
          weight: isSelected ? 2.5 : 1.5,
          radius: isSelected ? 8 : 5,
          fillOpacity: inc.status === 'resolved' ? 0.35 : 0.9,
        })
      } else {
        const marker = L.circleMarker([inc.lat, inc.lng], {
          radius: isSelected ? 8 : 5,
          fillColor: color,
          color: isSelected ? '#fff' : 'rgba(255,255,255,0.3)',
          weight: isSelected ? 2.5 : 1.5,
          opacity: 1,
          fillOpacity: inc.status === 'resolved' ? 0.35 : 0.9,
        }).addTo(map)

        marker.on('click', () => onSelectRef.current?.(inc.id))

        markers[inc.id] = marker
      }
    })

    Object.keys(markers).forEach((id) => {
      if (!newIds.has(id)) {
        map.removeLayer(markers[id])
        delete markers[id]
      }
    })
  }, [incidents, selectedId])

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0">
        <div className="absolute bottom-4 left-4 z-1000 flex flex-wrap gap-1.5">
          {Object.entries(DISASTER_TYPES).map(([type, spec]) => (
            <div
              key={type}
              className="flex items-center gap-1.5 bg-black/70 px-2.5 py-1.5 rounded-md"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: spec.color }} />
              <span className="text-[10px] text-white/70 font-medium whitespace-nowrap">{type}</span>
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 z-10">
          <MapSkeleton />
        </div>
      )}
    </div>
  )
}

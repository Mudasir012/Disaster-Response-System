import { useEffect, useRef, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { DISASTER_TYPES } from './constants'
import MapSkeleton from './MapSkeleton'

function createMarkerEl(inc, isSelected, disaster, onClick) {
  const size = 12
  const selectedSize = 18

  const el = document.createElement('div')
  el.style.cssText = `
    width: ${isSelected ? selectedSize : size}px;
    height: ${isSelected ? selectedSize : size}px;
    border-radius: 50%;
    background: ${disaster.color};
    opacity: ${inc.status === 'resolved' ? 0.4 : 1};
    border: ${isSelected ? '2px solid #f8fafc' : '2px solid rgba(248,250,252,0.25)'};
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 0 14px ${disaster.glow};
    pointer-events: auto;
  `
  el.addEventListener('click', onClick)
  return el
}

function updateMarkerEl(el, inc, isSelected, disaster) {
  const size = 12
  const selectedSize = 18
  el.style.width = `${isSelected ? selectedSize : size}px`
  el.style.height = `${isSelected ? selectedSize : size}px`
  el.style.background = disaster.color
  el.style.opacity = inc.status === 'resolved' ? '0.4' : '1'
  el.style.border = isSelected ? '2px solid #f8fafc' : '2px solid rgba(248,250,252,0.25)'
  el.style.boxShadow = `0 0 14px ${disaster.glow}`
}

export default function MapView({ incidents, selectedId, onSelect, loading }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(new Map())
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  const handleClick = useCallback((id) => {
    onSelectRef.current?.(id)
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'dark-matter': {
            type: 'raster',
            tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; CARTO',
          },
        },
        layers: [
          { id: 'dark-matter', type: 'raster', source: 'dark-matter' },
        ],
      },
      center: [20, 20],
      zoom: 1.8,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right')

    const resizeObserver = new ResizeObserver(() => {
      map.resize()
    })
    resizeObserver.observe(containerRef.current)

    mapRef.current = map

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !incidents) return

    const markers = markersRef.current
    const prevIds = new Set(markers.keys())
    const nextIds = new Set()

    incidents.forEach((inc) => {
      if (!inc.lat || !inc.lng) return
      nextIds.add(inc.id)

      const disaster = DISASTER_TYPES[inc.type] || { color: '#94a3b8', glow: 'rgba(148,163,184,0.35)' }
      const isSelected = selectedId === inc.id

      if (markers.has(inc.id)) {
        const existing = markers.get(inc.id)
        updateMarkerEl(existing.getElement(), inc, isSelected, disaster)
        existing.setLngLat([inc.lng, inc.lat])
      } else {
        const el = createMarkerEl(inc, isSelected, disaster, () => handleClick(inc.id))
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([inc.lng, inc.lat])
          .addTo(map)
        markers.set(inc.id, marker)
      }
    })

    for (const id of prevIds) {
      if (!nextIds.has(id)) {
        markers.get(id).remove()
        markers.delete(id)
      }
    }
  }, [incidents, selectedId, handleClick])

  return (
    <div className="absolute inset-0">
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ contain: 'layout style paint' }}
      >
        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1.5">
          {Object.entries(DISASTER_TYPES).map(([type, spec]) => (
            <div
              key={type}
              className="flex items-center gap-1.5 bg-deep-slate/80 backdrop-blur-sm px-2.5 py-1.5 rounded-md"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: spec.color }} />
              <span className="text-[10px] text-cool-gray/70 font-medium whitespace-nowrap">{type}</span>
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 z-10 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.1,1)]">
          <MapSkeleton />
        </div>
      )}
    </div>
  )
}

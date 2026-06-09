import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { DISASTER_TYPES } from './constants'

export default function MapView({ incidents, selectedId, onSelect, loading }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

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

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    incidents.forEach((inc) => {
      if (!inc.lat || !inc.lng) return

      const disaster = DISASTER_TYPES[inc.type] || { color: '#94a3b8', glow: 'rgba(148,163,184,0.35)' }
      const isSelected = selectedId === inc.id
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

      el.addEventListener('click', () => onSelect?.(inc.id))

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([inc.lng, inc.lat])
        .addTo(map)

      markersRef.current.push(marker)
    })
  }, [incidents, selectedId, onSelect])

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
        <div className="absolute inset-0 flex items-center justify-center bg-surface/50 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-signal-blue animate-spin" />
            <span className="text-xs text-cool-gray/60">Loading map data...</span>
          </div>
        </div>
      )}
    </div>
  )
}

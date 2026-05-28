import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { SEVERITY, SEVERITY_ORDER } from './constants'

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
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !incidents) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const sorted = SEVERITY_ORDER
      .flatMap((key) => incidents.filter((i) => i.severity === key))
      .concat(incidents.filter((i) => !SEVERITY_ORDER.includes(i.severity)))

    sorted.forEach((inc) => {
      const sev = SEVERITY[inc.severity] || SEVERITY.info
      const el = document.createElement('div')

      const size = inc.severity === 'critical' || inc.severity === 'severe' ? 14 : 10
      const isSelected = selectedId === inc.id

      el.style.cssText = `
        width: ${isSelected ? size + 8 : size}px;
        height: ${isSelected ? size + 8 : size}px;
        border-radius: 50%;
        background: ${sev.color};
        opacity: ${inc.status === 'resolved' ? 0.4 : 1};
        border: ${isSelected ? '2px solid #f8fafc' : '2px solid rgba(248,250,252,0.3)'};
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 0 12px ${sev.color}40;
        pointer-events: auto;
      `

      el.addEventListener('click', () => onSelect?.(inc.id))

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([inc.lng, inc.lat])
        .addTo(map)

      markersRef.current.push(marker)
    })
  }, [incidents, selectedId, onSelect])

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-surface/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-signal-blue animate-spin" />
          <span className="text-xs text-cool-gray/60">Loading map data...</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ contain: 'layout style paint' }}>
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        {SEVERITY_ORDER.filter((k) => k !== 'tsunami').map((key) => {
          const sev = SEVERITY[key]
          return (
            <div key={key} className="flex items-center gap-1.5 bg-deep-slate/80 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
              <span className="w-2 h-2 rounded-full" style={{ background: sev.color }} />
              <span className="text-[10px] text-cool-gray/70 font-medium">{sev.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

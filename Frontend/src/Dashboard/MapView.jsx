import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { DISASTER_TYPES } from './constants'
import MapSkeleton from './MapSkeleton'

const SVG_ICONS = {
  Earthquake: `<svg viewBox="0 0 24 24"><path d="M12 2 22 12 12 22 2 12Z" fill="currentColor"/><path d="M8 12h8M12 8v8" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  Flood: `<svg viewBox="0 0 24 24"><path d="M12 3C7 10 4 14 4 17.5a8 8 0 1 0 16 0C20 14 17 10 12 3Z" fill="currentColor"/></svg>`,
  Wildfire: `<svg viewBox="0 0 24 24"><path d="M12 3C7 9 5 12.5 5 16a7 7 0 1 0 14 0C19 12.5 17 9 12 3Z" fill="currentColor"/></svg>`,
  Hurricane: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  Tsunami: `<svg viewBox="0 0 24 24"><path d="M3 15q3-5 6 0q3 5 6 0q3-5 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 21h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  Tornado: `<svg viewBox="0 0 24 24"><path d="M6 3h12M8 8h8M10 13h4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="12" cy="20" rx="3" ry="2" fill="currentColor"/></svg>`,
  'Volcanic Eruption': `<svg viewBox="0 0 24 24"><path d="M12 4 4 20h16Z" fill="currentColor"/><circle cx="12" cy="17" r="2" fill="rgba(255,255,255,0.85)"/></svg>`,
  Landslide: `<svg viewBox="0 0 24 24"><path d="M4 17l5-7 4 4 5-8 3 11Z" fill="currentColor"/></svg>`,
}

function buildIcon(svg, color, size, selected, resolved) {
  const s = selected ? size + 6 : size
  return L.divIcon({
    html: `<div style="
      width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center;
      background:rgba(15,23,42,0.55);border-radius:50%;backdrop-filter:blur(3px);
      color:${color};opacity:${resolved ? 0.4 : 1};
      border:${selected ? '2px solid #f8fafc' : '2px solid rgba(248,250,252,0.2)'};
      box-shadow:0 0 10px ${color};
      transition:all 0.15s ease;
    ">${svg}</div>`,
    className: '',
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
  })
}

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
      zoom: 2,
      minZoom: 2,
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
      const svg = SVG_ICONS[type] || SVG_ICONS.Earthquake
      const isSelected = selectedId === inc.id
      const resolved = inc.status === 'resolved'
      const icon = buildIcon(svg, color, 20, isSelected, resolved)

      if (markers[inc.id]) {
        const m = markers[inc.id]
        m.setLatLng([inc.lat, inc.lng])
        m.setIcon(icon)
      } else {
        const marker = L.marker([inc.lat, inc.lng], { icon }).addTo(map)
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
              <span
                className="shrink-0 flex items-center justify-center"
                style={{ color: spec.color, width: 14, height: 14 }}
                dangerouslySetInnerHTML={{
                  __html: (SVG_ICONS[type] || SVG_ICONS.Earthquake)
                    .replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" width="12" height="12"'),
                }}
              />
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

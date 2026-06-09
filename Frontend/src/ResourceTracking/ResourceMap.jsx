import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function buildIcon(type, status, TYPE_COLORS, STATUS_COLORS) {
  const color = TYPE_COLORS[type] || '#6b7280'
  const border = STATUS_COLORS[status] || '#22c55e'
  const label = type === 'supply_point' ? 'SP' : type === 'medical_post' ? 'M' : type.charAt(0).toUpperCase()
  return L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};border:3px solid ${border};display:flex;align-items:center;justify-content:center;font:bold 11px/1 monospace;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.5);">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

export default function ResourceMap({
  resources, onSelect,
  route, isochrones, onIsochrone, clearOverlays,
  TYPE_COLORS, STATUS_COLORS, sidebarRef,
  placing, onPlace,
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const routeLayerRef = useRef(null)
  const isochroneLayersRef = useRef([])
  const placeMarkerRef = useRef(null)
  const tooltipRef = useRef(null)
  const [ready, setReady] = useState(false)

  const placingRef = useRef(false)
  placingRef.current = placing
  const onPlaceRef = useRef(onPlace)
  onPlaceRef.current = onPlace
  const onIsochroneRef = useRef(onIsochrone)
  onIsochroneRef.current = onIsochrone
  const clearOverlaysRef = useRef(clearOverlays)
  clearOverlaysRef.current = clearOverlays
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    try {
      const map = L.map(containerRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map)

      map.on('click', (e) => {
        if (placingRef.current) {
          onPlaceRef.current(e.latlng.lng, e.latlng.lat)
          return
        }
        clearOverlaysRef.current()
        onSelectRef.current(null)
        if (placeMarkerRef.current) map.removeLayer(placeMarkerRef.current)
        placeMarkerRef.current = L.circleMarker([e.latlng.lat, e.latlng.lng], {
          radius: 6, color: '#fff', fillColor: '#8b5cf6', fillOpacity: 0.9, weight: 2,
        }).addTo(map)
        onIsochroneRef.current(e.latlng.lng, e.latlng.lat)
      })

      const tooltipCtrl = L.control({ position: 'topcenter' })
      tooltipCtrl.onAdd = () => {
        const div = L.DomUtil.create('div')
        div.style.cssText = 'display:none;padding:6px 14px;border-radius:8px;background:rgba(13,17,23,0.9);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;font:11px/1 monospace;backdrop-filter:blur(8px);pointer-events:none;'
        tooltipRef.current = div
        return div
      }
      tooltipCtrl.addTo(map)

      mapRef.current = map
      setReady(true)
    } catch (e) {
      console.error('Map init failed:', e)
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.getContainer().style.cursor = placing ? 'crosshair' : ''
    if (tooltipRef.current) {
      tooltipRef.current.style.display = placing ? 'block' : 'none'
      tooltipRef.current.textContent = placing ? 'Click on map to place a resource' : ''
    }
  }, [placing])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const markerMap = markersRef.current
    const ids = new Set(resources.map((r) => r._id))
    Object.entries(markerMap).forEach(([id, m]) => { if (!ids.has(id)) { map.removeLayer(m); delete markerMap[id] } })
    resources.forEach((r) => {
      const [lng, lat] = r.location?.coordinates || [0, 0]
      if (!lng && !lat) return
      if (markerMap[r._id]) {
        const m = markerMap[r._id]
        const cur = m.getLatLng()
        if (cur.lat !== lat || cur.lng !== lng) m.setLatLng([lat, lng])
        m.setIcon(buildIcon(r.type, r.status, TYPE_COLORS, STATUS_COLORS))
      } else {
        const icon = buildIcon(r.type, r.status, TYPE_COLORS, STATUS_COLORS)
        const marker = L.marker([lat, lng], { icon }).addTo(map)
        const d = r.details || {}
        marker.bindPopup(
          `<div style="font:13px/1.5 monospace;color:#e2e8f0;min-width:180px">
            <div style="font-weight:700;margin-bottom:4px;color:${TYPE_COLORS[r.type] || '#fff'}">${r.name}</div>
            <div>Type: ${r.type.replace(/_/g, ' ')}</div>
            <div>Status: <span style="color:${STATUS_COLORS[r.status] || '#22c55e'}">${r.status}</span></div>
            ${d.capacity ? `<div>Capacity: ${d.capacity}</div>` : ''}
            ${d.current_load ? `<div>Load: ${d.current_load}</div>` : ''}
          </div>`,
          { className: 'resource-popup', closeButton: true }
        )
        marker.on('click', () => onSelectRef.current(r._id))
        markerMap[r._id] = marker
      }
    })
  }, [resources, TYPE_COLORS, STATUS_COLORS])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (routeLayerRef.current) { map.removeLayer(routeLayerRef.current); routeLayerRef.current = null }
    if (!route) return
    const coords = route.features?.[0]?.geometry?.coordinates
    if (!coords) return
    const layer = L.polyline(coords.map((c) => [c[1], c[0]]), { color: '#8b5cf6', weight: 4, opacity: 0.8 }).addTo(map)
    routeLayerRef.current = layer
    map.fitBounds(layer.getBounds().pad(0.3))
  }, [route])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    isochroneLayersRef.current.forEach((l) => { if (l) map.removeLayer(l) })
    isochroneLayersRef.current = []
    if (!isochrones?.length) return
    const layers = isochrones.map((f, i) => {
      const coords = f.geometry?.coordinates?.[0]
      if (!coords) return null
      const km = ((f.properties?.value || 0) / 1000).toFixed(0)
      return L.polygon(coords.map((c) => [c[1], c[0]]), {
        color: '#8b5cf6', weight: 1, fillColor: '#8b5cf6', fillOpacity: Math.max(0.08, 0.25 - i * 0.06),
      }).bindTooltip(`${km} km`, { permanent: false, direction: 'center' })
    }).filter(Boolean)
    layers.forEach((l) => l.addTo(map))
    isochroneLayersRef.current = layers
    if (layers.length) {
      const b = L.latLngBounds([])
      layers.forEach((l) => b.extend(l.getBounds()))
      if (b.isValid()) map.fitBounds(b.pad(0.2))
    }
  }, [isochrones])

  useEffect(() => {
    if (!mapRef.current || !sidebarRef?.current) return
    const o = new ResizeObserver(() => mapRef.current?.invalidateSize())
    o.observe(sidebarRef.current)
    return () => o.disconnect()
  }, [sidebarRef])

  return (
    <div ref={containerRef} className="absolute inset-0 z-10" />
  )
}

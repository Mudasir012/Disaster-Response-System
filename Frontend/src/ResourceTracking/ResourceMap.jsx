import { useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function buildIcon(type, status, TYPE_COLORS, STATUS_COLORS) {
  const color = TYPE_COLORS[type] || '#6b7280'
  const border = STATUS_COLORS[status] || '#22c55e'
  const label = type === 'supply_point' ? 'SP' : type === 'medical_post' ? 'M' : type.charAt(0).toUpperCase()

  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:${color};border:3px solid ${border};
      display:flex;align-items:center;justify-content:center;
      font:bold 11px/1 monospace;color:#fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.5);
      transition:transform 0.2s;
    ">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function buildRouteLayer(data) {
  const coords = data?.features?.[0]?.geometry?.coordinates
  if (!coords) return null
  const latlngs = coords.map((c) => [c[1], c[0]])
  return L.polyline(latlngs, {
    color: '#8b5cf6',
    weight: 4,
    opacity: 0.8,
    dashArray: null,
  })
}

function buildIsochroneLayers(features) {
  return features.map((f, i) => {
    const coords = f.geometry?.coordinates?.[0]
    if (!coords) return null
    const latlngs = coords.map((c) => [c[1], c[0]])
    const range = f.properties?.value || 0
    const km = (range / 1000).toFixed(0)
    const opacity = Math.max(0.08, 0.25 - i * 0.06)
    return L.polygon(latlngs, {
      color: '#8b5cf6',
      weight: 1,
      fillColor: '#8b5cf6',
      fillOpacity: opacity,
    }).bindTooltip(`${km} km`, { permanent: false, direction: 'center' })
  }).filter(Boolean)
}

export default function ResourceMap({
  resources, selected, onSelect,
  route, isochrones, onRoute, onIsochrone, clearOverlays,
  TYPE_COLORS, STATUS_COLORS, onRefresh, sidebarRef,
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const routeLayerRef = useRef(null)
  const isochroneLayersRef = useRef([])
  const clickMarkerRef = useRef(null)

  const initMap = useCallback(() => {
    if (mapRef.current || !containerRef.current) return

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

    const onMapClick = (e) => {
      const { lat, lng } = e.latlng
      clearOverlays()
      if (onSelect) onSelect(null)

      if (clickMarkerRef.current) {
        map.removeLayer(clickMarkerRef.current)
      }
      clickMarkerRef.current = L.circleMarker([lat, lng], {
        radius: 6,
        color: '#fff',
        fillColor: '#8b5cf6',
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(map)

      if (onIsochrone) onIsochrone(lng, lat)
    }

    map.on('click', onMapClick)

    mapRef.current = map
    return () => {
      map.off('click', onMapClick)
    }
  }, [clearOverlays, onSelect, onIsochrone])

  useEffect(() => {
    initMap()
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [initMap])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const markerMap = markersRef.current
    const existingIds = new Set(resources.map((r) => r._id))

    Object.entries(markerMap).forEach(([id, marker]) => {
      if (!existingIds.has(id)) {
        map.removeLayer(marker)
        delete markerMap[id]
      }
    })

    resources.forEach((r) => {
      const [lng, lat] = r.location?.coordinates || [0, 0]
      if (!lng && !lat) return

      if (markerMap[r._id]) {
        const m = markerMap[r._id]
        const cur = m.getLatLng()
        if (cur.lat !== lat || cur.lng !== lng) {
          m.setLatLng([lat, lng])
        }
        m.setIcon(buildIcon(r.type, r.status, TYPE_COLORS, STATUS_COLORS))
      } else {
        const icon = buildIcon(r.type, r.status, TYPE_COLORS, STATUS_COLORS)
        const marker = L.marker([lat, lng], { icon }).addTo(map)

        const detail = r.details || {}
        const info = [
          `<div style="font:13px/1.5 monospace;color:#e2e8f0;min-width:180px">`,
          `<div style="font-weight:700;margin-bottom:4px;color:${TYPE_COLORS[r.type] || '#fff'}">${r.name}</div>`,
          `<div>Type: ${r.type.replace(/_/g, ' ')}</div>`,
          `<div>Status: <span style="color:${STATUS_COLORS[r.status] || '#22c55e'}">${r.status}</span></div>`,
          detail.capacity ? `<div>Capacity: ${detail.capacity}</div>` : '',
          detail.current_load ? `<div>Load: ${detail.current_load}</div>` : '',
          detail.contact ? `<div>Contact: ${detail.contact}</div>` : '',
          `</div>`,
        ].join('')

        marker.bindPopup(info, {
          className: 'resource-popup',
          closeButton: true,
        })

        marker.on('click', () => {
          if (onSelect) onSelect(r._id)
        })

        markerMap[r._id] = marker
      }
    })
  }, [resources, TYPE_COLORS, STATUS_COLORS, onSelect])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }

    if (route) {
      const layer = buildRouteLayer(route)
      if (layer) {
        layer.addTo(map)
        routeLayerRef.current = layer
        map.fitBounds(layer.getBounds().pad(0.3))
      }
    }
  }, [route])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    isochroneLayersRef.current.forEach((l) => {
      if (l) map.removeLayer(l)
    })
    isochroneLayersRef.current = []

    if (isochrones.length) {
      const layers = buildIsochroneLayers(isochrones)
      layers.forEach((l) => {
        if (l) l.addTo(map)
      })
      isochroneLayersRef.current = layers

      if (layers.length) {
        const allBounds = L.latLngBounds([])
        layers.forEach((l) => {
          if (l) allBounds.extend(l.getBounds())
        })
        if (allBounds.isValid()) map.fitBounds(allBounds.pad(0.2))
      }
    }
  }, [isochrones])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !sidebarRef?.current) return

    const sidebar = sidebarRef.current
    const observer = new ResizeObserver(() => {
      map.invalidateSize()
    })
    observer.observe(sidebar)
    return () => observer.disconnect()
  }, [sidebarRef])

  return (
    <div ref={containerRef} className="absolute inset-0 z-10" />
  )
}

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useIncidentStore } from '../../store/useIncidentStore'
import { useFilterStore } from '../../store/useFilterStore'
import { getSeverityColor } from '../ui/SeverityBadge'

export default function MapCanvas({ onIncidentClick }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const popup = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const { incidents, fetchIncidents } = useIncidentStore()
  const { types, severityMin, severityMax, timeRange, region } = useFilterStore()

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [0, 20],
      zoom: 2.5,
      attributionControl: false,
    })

    m.addControl(new maplibregl.NavigationControl(), 'bottom-right')
    m.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')

    m.on('load', () => {
      setMapLoaded(true)
      m.addSource('incidents', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true,
        clusterMaxZoom: 5,
        clusterRadius: 50,
      })

      m.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'incidents',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#e94560', 5, '#d97706', 10, '#0f7ddb'],
          'circle-radius': ['step', ['get', 'point_count'], 20, 5, 28, 10, 36],
          'circle-opacity': 0.7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      })

      m.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'incidents',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Open Sans Bold'],
          'text-size': 12,
        },
        paint: { 'text-color': '#ffffff' },
      })

      m.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'incidents',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': ['get', 'radius'],
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.5,
        },
      })

      m.on('click', 'clusters', (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        const clusterId = features[0].properties.cluster_id
        m.getSource('incidents').getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return
          m.easeTo({ center: features[0].geometry.coordinates, zoom })
        })
      })

      m.on('click', 'unclustered-point', (e) => {
        const feature = e.features[0]
        if (onIncidentClick) {
          onIncidentClick(feature.properties._id)
        }
      })

      m.on('mouseenter', 'unclustered-point', () => { m.getCanvas().style.cursor = 'pointer' })
      m.on('mouseleave', 'unclustered-point', () => { m.getCanvas().style.cursor = '' })

      m.on('mousemove', 'unclustered-point', (e) => {
        if (popup.current) popup.current.remove()
        const feat = e.features[0]
        const p = feat.properties
        popup.current = new maplibregl.Popup({
          closeButton: false, closeOnClick: false, offset: 12, className: 'incident-popup',
        })
          .setLngLat(feat.geometry.coordinates)
          .setHTML(`
            <div style="padding:8px 12px;min-width:160px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <span style="display:inline-block;width:${p.severity >= 4 ? '10px' : '8px'};height:${p.severity >= 4 ? '10px' : '8px'};border-radius:50%;background:${p.color}"></span>
                <span style="font-size:11px;font-weight:600;text-transform:capitalize">${p.event_type}</span>
                <span style="font-size:10px;padding:1px 6px;border-radius:999px;background:${p.color}20;color:${p.color};font-weight:600">SEV-${p.severity}</span>
              </div>
              <div style="font-size:12px;font-weight:500;color:#f8fafc">${p.location_name}</div>
              <div style="font-size:10px;color:#94a3b8;margin-top:2px">${p.time_ago}</div>
            </div>
          `)
          .setLngLat(feat.geometry.coordinates)
          .addTo(m)
      })

      m.on('mouseleave', 'unclustered-point', () => {
        if (popup.current) { popup.current.remove(); popup.current = null }
      })
    })

    map.current = m

    return () => {
      m.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !map.current) return

    const features = incidents
      .filter((inc) => inc.location?.lat && inc.location?.lng)
      .filter((inc) => {
        if (types.length > 0 && !types.includes(inc.event_type)) return false
        if (inc.severity < severityMin || inc.severity > severityMax) return false
        return true
      })
      .map((inc) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [inc.location.lng, inc.location.lat] },
        properties: {
          _id: inc._id,
          event_type: inc.event_type,
          severity: inc.severity,
          color: getSeverityColor(inc.severity),
          radius: 6 + inc.severity * 3,
          location_name: inc.location.name,
          time_ago: timeAgo(inc.created_at),
        },
      }))

    const source = map.current.getSource('incidents')
    if (source) {
      source.setData({ type: 'FeatureCollection', features })
    }

    if (region && region !== 'worldwide') {
      const regionCoords = {
        asia: [90, 30], africa: [20, 0], europe: [15, 50],
        americas: [-90, 30], oceania: [135, -25],
      }
      const coords = regionCoords[region.toLowerCase()]
      if (coords) {
        map.current.flyTo({ center: coords, zoom: 3, duration: 1000 })
      }
    }
  }, [incidents, types, severityMin, severityMax, region, mapLoaded])

  return (
    <div ref={mapContainer} className="absolute inset-0" style={{ top: 0, left: 0, right: 0, bottom: 0 }} />
  )
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

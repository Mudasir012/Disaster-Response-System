import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Menu } from 'lucide-react'
import MapCanvas from '../components/map/MapCanvas'
import Sidebar from '../components/map/Sidebar'
import DetailPanel from '../components/map/DetailPanel'
import Navbar from '../components/ui/Navbar'
import { useIncidentStore } from '../store/useIncidentStore'
import { useFilterStore } from '../store/useFilterStore'
import { useSocketStore } from '../store/useSocketStore'

export default function MapDashboard() {
  const [searchParams] = useSearchParams()
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const { incidents, fetchIncidents, statsSummary } = useIncidentStore()
  const { sidebarOpen, toggleSidebar, types, severityMin, severityMax, timeRange, region, search } = useFilterStore()
  const { connected } = useSocketStore()

  const buildParams = useCallback(() => {
    const params = {}
    const type = searchParams.get('type')
    if (type) params.type = type
    if (types.length > 0) params.type = types.join(',')
    if (severityMin > 1 || severityMax < 5) params.severity = `${severityMin}-${severityMax}`
    if (region !== 'worldwide') params.region = region
    if (search) params.search = search
    if (timeRange !== 'all') {
      const hours = { '1h': 1, '6h': 6, '24h': 24, '7d': 168 }
      const h = hours[timeRange]
      if (h) params.from = new Date(Date.now() - h * 3600000).toISOString()
    }
    return params
  }, [searchParams, types, severityMin, severityMax, timeRange, region, search])

  useEffect(() => {
    fetchIncidents(buildParams())
  }, [buildParams, fetchIncidents])

  const handleIncidentClick = (id) => setSelectedIncident(id)

  return (
    <div className="h-screen flex flex-col bg-deep-slate">
      <Navbar activeCount={statsSummary?.active || incidents.length} connected={connected} />

      <div className="flex-1 relative overflow-hidden pt-14">
        <MapCanvas onIncidentClick={handleIncidentClick} />

        <Sidebar
          onSelectIncident={(inc) => setSelectedIncident(inc._id)}
          onClose={() => toggleSidebar()}
        />

        {!sidebarOpen && (
          <button
            onClick={() => toggleSidebar()}
            className="fixed left-3 top-16 z-30 p-2 bg-surface/80 backdrop-blur-sm border border-white/10 rounded-lg text-cool-gray hover:text-glacier-white transition-all hover:bg-surface"
          >
            <Menu size={18} />
          </button>
        )}

        <button
          onClick={() => setMobileSidebar(true)}
          className="md:hidden fixed left-3 top-16 z-30 p-2 bg-surface/80 backdrop-blur-sm border border-white/10 rounded-lg text-cool-gray"
        >
          <Menu size={18} />
        </button>

        {mobileSidebar && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
            <div className="absolute left-0 top-14 bottom-0 w-[300px] bg-deep-slate/95 backdrop-blur-xl border-r border-white/[0.08] overflow-y-auto p-4 animate-slide-in-left">
              <Sidebar onSelectIncident={(inc) => { setSelectedIncident(inc._id); setMobileSidebar(false) }}
                onClose={() => setMobileSidebar(false)} />
            </div>
          </div>
        )}

        {selectedIncident && (
          <DetailPanel incidentId={selectedIncident} onClose={() => setSelectedIncident(null)} />
        )}
      </div>
    </div>
  )
}

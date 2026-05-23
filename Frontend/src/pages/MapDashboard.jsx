import { useEffect, useState } from 'react'
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
  const { sidebarOpen, toggleSidebar } = useFilterStore()
  const { connected } = useSocketStore()

  useEffect(() => {
    const type = searchParams.get('type')
    const params = type ? { type } : {}
    fetchIncidents(params)
  }, [searchParams])

  const handleIncidentClick = (id) => {
    setSelectedIncident(id)
  }

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
            className="fixed left-3 top-16 z-30 p-2 bg-surface border border-white/10 rounded-lg text-cool-gray hover:text-glacier-white transition-colors"
          >
            <Menu size={18} />
          </button>
        )}

        {mobileSidebar && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebar(false)} />
            <div className="absolute left-0 top-14 bottom-0 w-[300px] bg-deep-slate border-r border-white/[0.08] overflow-y-auto p-4">
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

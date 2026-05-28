import { useState } from 'react'
import DashboardLayout from './DashboardLayout'
import MapView from './MapView'
import SidebarPanel from './SidebarPanel'
import WatchRegionPanel from './WatchRegionPanel'
import ChatWidget from './ChatWidget'
import incidentsData from './mockData'

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState(null)
  const [showRegions, setShowRegions] = useState(false)
  const [loading] = useState(false)

  return (
    <DashboardLayout onWatchRegions={() => setShowRegions(true)}>
      <h1 className="sr-only">Dashboard</h1>
      <div className="absolute inset-0 top-14">
        <MapView
          incidents={incidentsData}
          selectedId={selectedId}
          onSelect={setSelectedId}
          loading={loading}
        />
      </div>
      <div className="absolute top-14 right-0 bottom-0 w-[400px] lg:w-[460px] z-10">
        <SidebarPanel
          incidents={incidentsData}
          selectedId={selectedId}
          onSelect={setSelectedId}
          loading={loading}
        />
      </div>

      <WatchRegionPanel open={showRegions} onClose={() => setShowRegions(false)} />
      <ChatWidget />
    </DashboardLayout>
  )
}

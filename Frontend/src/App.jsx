import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import MapDashboard from './pages/MapDashboard'
import IncidentDetail from './pages/IncidentDetail'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<MapDashboard />} />
        <Route path="/incident/:id" element={<IncidentDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

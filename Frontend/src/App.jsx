import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './Landing/Landing'
import AuthPage from './Auth/AuthPage'
import Dashboard from './Dashboard/Dashboard'
import IncidentList from './Dashboard/IncidentList'
import IncidentDetail from './Dashboard/IncidentDetail'
import Analytics from './Dashboard/Analytics'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/incidents" element={<IncidentList />} />
      <Route path="/incidents/:id" element={<IncidentDetail />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

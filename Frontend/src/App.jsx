import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const Landing = lazy(() => import('./Landing/Landing'))
const AuthPage = lazy(() => import('./Auth/AuthPage'))
const Dashboard = lazy(() => import('./Dashboard/Dashboard'))
const IncidentList = lazy(() => import('./Dashboard/IncidentList'))
const IncidentDetail = lazy(() => import('./Dashboard/IncidentDetail'))
const Analytics = lazy(() => import('./Dashboard/Analytics'))
const ResourceTracking = lazy(() => import('./ResourceTracking/ResourceTracking'))

function PageFallback() {
  return (
    <div className="min-h-[100dvh] bg-[#05080f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-crisis-red animate-spin" />
        <span className="text-xs text-cool-gray/50 font-mono uppercase tracking-widest">Loading</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<IncidentList />} />
        <Route path="/incidents/:id" element={<IncidentDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/tracking" element={<ResourceTracking />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

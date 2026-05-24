import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShieldAlert, RefreshCw, LogOut,
  ArrowLeft, Loader,
} from 'lucide-react'
import HealthCards from '../components/admin/HealthCards'
import QueueDashboard from '../components/admin/QueueDashboard'
import IncidentTable from '../components/admin/IncidentTable'
import { useIncidentStore } from '../store/useIncidentStore'
import { api } from '../lib/api'
import { mockHealth, mockQueues, mockAILog, mockIncidents } from '../data/mockData'

const useMockData = !import.meta.env.VITE_API_URL

export default function Admin() {
  const navigate = useNavigate()
  const { incidents, fetchIncidents } = useIncidentStore()
  const [health, setHealth] = useState(null)
  const [queues, setQueues] = useState(null)
  const [aiLog, setAiLog] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [syncing, setSyncing] = useState(null)

  const isAuthed = document.cookie.includes('admin_token=')

  useEffect(() => {
    if (!isAuthed) { navigate('/admin/login'); return }
    fetchIncidents()
    if (useMockData) {
      setHealth(mockHealth)
      setQueues(mockQueues)
      setAiLog(mockAILog)
      return
    }
    Promise.all([
      api.adminHealth().then(setHealth),
      api.adminQueues().then(setQueues),
      api.adminAILog({}).then(setAiLog),
    ]).catch(() => {})
  }, [])

  const handleSync = async (source) => {
    setSyncing(source)
    await new Promise(r => setTimeout(r, 1500))
    setSyncing(null)
  }

  const handleEdit = () => {}
  const handleDelete = async () => {}
  const handleReprocess = async () => {}

  if (!isAuthed) return null

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'queues', label: 'Queues' },
    { key: 'incidents', label: 'Incidents' },
    { key: 'ai-log', label: 'AI Log' },
  ]

  const syncSources = ['GDACS', 'USGS', 'NOAA', 'NewsAPI', 'GDELT']

  return (
    <div className="min-h-screen bg-deep-slate">
      <div className="flex">
        <nav className="w-56 min-h-screen bg-deep-slate/90 border-r border-white/[0.06] p-4 shrink-0">
          <div className="flex items-center gap-2 mb-8">
            <ShieldAlert size={20} className="text-amber" />
            <span className="text-sm font-bold text-glacier-white">Admin Panel</span>
          </div>
          <div className="space-y-1 mb-6">
            {tabs.map((tab) => (
              <button key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'bg-amber/10 text-amber font-medium'
                    : 'text-cool-gray/60 hover:text-glacier-white hover:bg-white/5'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="border-t border-white/[0.05] pt-4 space-y-2">
            <Link to="/map"
              className="flex items-center gap-2 text-xs text-cool-gray/60 hover:text-glacier-white transition-colors">
              <ArrowLeft size={12} />
              Back to public
            </Link>
            <button onClick={() => { document.cookie = 'admin_token=; max-age=0'; navigate('/admin/login') }}
              className="flex items-center gap-2 text-xs text-crisis-red/70 hover:text-crisis-red transition-colors">
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        </nav>

        <main className="flex-1 p-6 animate-fade-in">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-xl font-bold text-glacier-white mb-6">System Overview</h1>
              <HealthCards health={health} />

              <div className="grid grid-cols-3 gap-4 mb-6">
                {syncSources.map((source) => (
                  <button key={source}
                    onClick={() => handleSync(source)}
                    disabled={syncing === source}
                    className={`flex items-center justify-center gap-2 bg-surface/50 border border-white/[0.06] rounded-xl p-4 text-sm text-glacier-white card-hover ${
                      syncing === source ? 'opacity-60' : ''
                    }`}>
                    {syncing === source ? (
                      <Loader size={16} className="animate-spin text-signal-blue" />
                    ) : (
                      <RefreshCw size={16} className="text-status-teal" />
                    )}
                    Sync {source} Now
                  </button>
                ))}
              </div>

              <QueueDashboard queues={queues} />
            </div>
          )}

          {activeTab === 'queues' && (
            <div>
              <h1 className="text-xl font-bold text-glacier-white mb-6">Queue Management</h1>
              <QueueDashboard queues={queues} />
            </div>
          )}

          {activeTab === 'incidents' && (
            <div>
              <h1 className="text-xl font-bold text-glacier-white mb-6">Incident Management</h1>
              <IncidentTable
                incidents={incidents.length > 0 ? incidents : mockIncidents}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReprocess={handleReprocess}
              />
            </div>
          )}

          {activeTab === 'ai-log' && (
            <div>
              <h1 className="text-xl font-bold text-glacier-white mb-6">AI Processing Log</h1>
              <div className="bg-surface/50 border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.05]">
                        <th className="text-left text-[11px] text-cool-gray/60 font-medium uppercase tracking-wider px-4 py-3">Time</th>
                        <th className="text-left text-[11px] text-cool-gray/60 font-medium uppercase tracking-wider px-4 py-3">Result</th>
                        <th className="text-right text-[11px] text-cool-gray/60 font-medium uppercase tracking-wider px-4 py-3">Input</th>
                        <th className="text-right text-[11px] text-cool-gray/60 font-medium uppercase tracking-wider px-4 py-3">Output</th>
                        <th className="text-right text-[11px] text-cool-gray/60 font-medium uppercase tracking-wider px-4 py-3">Duration</th>
                        <th className="text-center text-[11px] text-cool-gray/60 font-medium uppercase tracking-wider px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiLog.map((log) => (
                        <tr key={log._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 text-xs text-cool-gray/60">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-glacier-white text-xs">{log.result_summary}</td>
                          <td className="px-4 py-3 text-right text-cool-gray/60 text-xs">{log.prompt_tokens}</td>
                          <td className="px-4 py-3 text-right text-cool-gray/60 text-xs">{log.completion_tokens}</td>
                          <td className="px-4 py-3 text-right text-cool-gray/60 text-xs">{log.duration_ms}ms</td>
                          <td className="px-4 py-3 text-center">
                            {log.success
                              ? <span className="text-safe-green inline-flex items-center gap-1 text-xs">✓ Success</span>
                              : <span className="text-crisis-red inline-flex items-center gap-1 text-xs">✗ Failed</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

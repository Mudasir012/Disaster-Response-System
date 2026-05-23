import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Activity, Database, RefreshCw, ShieldAlert, LogOut,
  Server, Cpu, Radio, HardDrive, ArrowLeft, CheckCircle, XCircle, Loader,
} from 'lucide-react'
import HealthCards from '../components/admin/HealthCards'
import QueueDashboard from '../components/admin/QueueDashboard'
import IncidentTable from '../components/admin/IncidentTable'
import { useIncidentStore } from '../store/useIncidentStore'
import {
  mockHealth, mockQueues, mockAILog, mockIncidents,
} from '../data/mockData'

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
      fetch('/api/admin/health').then(r => r.json()).then(setHealth),
      fetch('/api/admin/queues').then(r => r.json()).then(setQueues),
      fetch('/api/admin/ai-log').then(r => r.json()).then(setAiLog),
    ]).catch(() => {})
  }, [])

  const handleSync = async (source) => {
    setSyncing(source)
    await new Promise(r => setTimeout(r, 1500))
    setSyncing(null)
  }

  const handleEdit = (incident) => { /* open edit modal, not implemented */ }
  const handleDelete = async (id) => { await new Promise(r => setTimeout(r, 500)) }
  const handleReprocess = async (id) => { await new Promise(r => setTimeout(r, 1000)) }

  if (!isAuthed) return null

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'queues', label: 'Queues' },
    { key: 'incidents', label: 'Incidents' },
    { key: 'ai-log', label: 'AI Log' },
  ]

  const syncSources = ['GDACS', 'USGS', 'NOAA', 'NewsAPI', 'Twitter']

  return (
    <div className="min-h-screen bg-[#111827]">
      <div className="flex">
        <nav className="w-56 min-h-screen bg-deep-slate border-r border-white/[0.08] p-4 shrink-0">
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
                    : 'text-cool-gray hover:text-glacier-white hover:bg-white/5'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-4 space-y-2">
            <Link to="/map"
              className="flex items-center gap-2 text-xs text-cool-gray hover:text-glacier-white transition-colors">
              <ArrowLeft size={12} />
              Back to public
            </Link>
            <button onClick={() => { document.cookie = 'admin_token=; max-age=0'; navigate('/admin/login') }}
              className="flex items-center gap-2 text-xs text-crisis-red hover:text-crisis-red/80 transition-colors">
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        </nav>

        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-xl font-bold text-glacier-white mb-6">System Overview</h1>
              <HealthCards health={health} />

              <div className="grid grid-cols-3 gap-4 mb-6">
                {syncSources.map((source) => (
                  <button key={source}
                    onClick={() => handleSync(source)}
                    disabled={syncing === source}
                    className={`flex items-center justify-center gap-2 bg-surface border border-white/[0.08] rounded-xl p-4 text-sm text-glacier-white transition-all hover:border-white/20 ${
                      syncing === source ? 'opacity-70' : ''
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
              <div className="bg-surface border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Time</th>
                        <th className="text-left text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Result</th>
                        <th className="text-right text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Input Tokens</th>
                        <th className="text-right text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Output Tokens</th>
                        <th className="text-right text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Duration</th>
                        <th className="text-center text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiLog.map((log) => (
                        <tr key={log._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-xs text-cool-gray">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-glacier-white text-xs">{log.result_summary}</td>
                          <td className="px-4 py-3 text-right text-cool-gray text-xs">{log.prompt_tokens}</td>
                          <td className="px-4 py-3 text-right text-cool-gray text-xs">{log.completion_tokens}</td>
                          <td className="px-4 py-3 text-right text-cool-gray text-xs">{log.duration_ms}ms</td>
                          <td className="px-4 py-3 text-center">
                            {log.success
                              ? <CheckCircle size={14} className="text-safe-green inline" />
                              : <XCircle size={14} className="text-crisis-red inline" />
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

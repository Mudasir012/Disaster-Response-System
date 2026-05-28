import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from './DashboardLayout'
import { SEVERITY } from './constants'
import incidentsData from './mockData'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} minutes ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hours ago`
  return `${Math.floor(hrs / 24)} days ago`
}

export default function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const incident = useMemo(
    () => incidentsData.find((i) => i.id === id),
    [id]
  )

  if (!incident) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold text-cool-gray/40">Incident not found</p>
          <button
            onClick={() => navigate('/incidents')}
            className="text-sm text-signal-blue hover:text-glacier-white transition-colors duration-200"
          >
            Back to incidents
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const sev = SEVERITY[incident.severity] || SEVERITY.info

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-cool-gray/50 hover:text-glacier-white transition-colors duration-200"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back</span>
          </button>

          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ background: sev.color }} />
                <h1 className="font-sora text-2xl font-bold text-glacier-white">
                  {incident.type}
                </h1>
                <span
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: sev.bg, color: sev.color }}
                >
                  {sev.label}
                </span>
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                    incident.status === 'active'
                      ? 'text-status-teal bg-status-teal/10'
                      : incident.status === 'monitoring'
                      ? 'text-amber bg-amber/10'
                      : 'text-cool-gray/40 bg-white/[0.04]'
                  }`}
                >
                  {incident.status}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-cool-gray/70">{incident.location}</p>
              <p className="mt-0.5 font-mono text-xs text-cool-gray/40">{incident.id} &middot; {timeAgo(incident.timestamp)} &middot; {incident.source}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-glacier-white/70 hover:border-white/20 hover:text-glacier-white transition-all duration-200">
                Share
              </button>
              <button className="rounded-lg bg-crisis-red px-5 py-2 text-xs font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Subscribe to updates
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface rounded-xl border border-white/[0.04] p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/50 mb-3">Summary</h2>
                <p className="text-sm text-glacier-white/80 leading-relaxed">{incident.summary}</p>
              </div>

              <div className="bg-surface rounded-xl border border-white/[0.04] p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/50 mb-4">Impact</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Casualties', value: incident.casualties, color: '#e94560' },
                    { label: 'Affected', value: incident.affected.toLocaleString(), color: '#d97706' },
                    { label: 'Magnitude', value: incident.magnitude > 0 ? `M ${incident.magnitude}` : 'N/A', color: '#0f7ddb' },
                    { label: 'Status Duration', value: timeAgo(incident.timestamp), color: '#94a3b8' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-deep-slate rounded-lg p-4">
                      <p className="text-2xl font-bold text-glacier-white" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-[11px] text-cool-gray/50 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-xl border border-white/[0.04] p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/50 mb-4">AI Analysis</h2>
                <div className="bg-gradient-to-br from-[#1a1040] to-[#110a2e] rounded-lg border border-[#7c3aed]/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 0 1 4-4z" />
                      <path d="M2 22v-2c0-4 4-6 10-6s10 2 10 6v2" />
                    </svg>
                    <span className="text-xs font-semibold text-[#7c3aed]">Gemini Assessment</span>
                  </div>
                  <p className="text-sm text-glacier-white/70 leading-relaxed">
                    This {incident.type.toLowerCase()} event in {incident.location} is assessed as {sev.label.toLowerCase()} severity. 
                    Historical data suggests {incident.casualties > 5 ? 'elevated' : 'manageable'} casualty risk. 
                    {incident.status === 'active' ? ' Active monitoring recommended for the next 24-48 hours based on current trajectory.' : ' Situation appears to be stabilizing based on latest reporting.'} 
                    Population density in the affected area amplifies the humanitarian impact score.
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-[10px] text-[#7c3aed]/60">Confidence</span>
                    <div className="flex-1 h-1 bg-deep-slate rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#7c3aed]" style={{ width: '87%' }} />
                    </div>
                    <span className="text-[10px] font-mono text-[#7c3aed]/60">87%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-surface rounded-xl border border-white/[0.04] p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/50 mb-3">Location</h2>
                <div className="aspect-square bg-deep-slate rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-mono text-xs text-cool-gray/40">{incident.lat.toFixed(2)}, {incident.lng.toFixed(2)}</p>
                    <p className="text-[10px] text-cool-gray/30 mt-1">{incident.region}</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-xl border border-white/[0.04] p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/50 mb-3">Source Feed</h2>
                <div className="space-y-3">
                  {[
                    { source: incident.source, time: '2 min ago', label: 'Initial alert' },
                    { source: incident.source, time: '15 min ago', label: 'Updated coordinates' },
                    { source: 'ReliefWeb', time: '45 min ago', label: 'Situation report' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-signal-blue/50 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-glacier-white/80">{item.label}</p>
                        <p className="text-[10px] text-cool-gray/40 mt-0.5">{item.source} &middot; {item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-xl border border-white/[0.04] p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/50 mb-3">Quick Actions</h2>
                <div className="space-y-2">
                  <button className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-glacier-white/70 hover:border-white/20 hover:text-glacier-white transition-all duration-200 text-left">
                    Deploy response team
                  </button>
                  <button className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-glacier-white/70 hover:border-white/20 hover:text-glacier-white transition-all duration-200 text-left">
                    Open in map view
                  </button>
                  <button className="w-full rounded-lg border border-crisis-red/20 text-crisis-red/80 hover:bg-crisis-red/10 hover:text-crisis-red transition-all duration-200 px-4 py-2.5 text-xs font-medium text-left">
                    Escalate severity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

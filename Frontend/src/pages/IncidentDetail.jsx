import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Bell, Share2, Download } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import SeverityBadge, { getSeverityColor } from '../components/ui/SeverityBadge'
import AISummaryCard from '../components/incident/AISummaryCard'
import Timeline from '../components/incident/Timeline'
import RelatedIncidents from '../components/incident/RelatedIncidents'
import { useIncidentStore } from '../store/useIncidentStore'

export default function IncidentDetail() {
  const { id } = useParams()
  const { activeIncident, fetchIncident } = useIncidentStore()

  useEffect(() => {
    if (id) fetchIncident(id)
  }, [id])

  if (!activeIncident) {
    return (
      <main className="min-h-screen bg-deep-slate flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-crisis-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-cool-gray/60">Loading incident...</p>
        </div>
      </main>
    )
  }

  const inc = activeIncident

  return (
    <main className="min-h-screen bg-deep-slate">
      <Navbar />
      <div className="pt-14">
        <div className="max-w-5xl mx-auto px-4 py-6 animate-fade-in">
          <Link to="/map" className="inline-flex items-center gap-1.5 text-sm text-cool-gray hover:text-glacier-white transition-colors mb-6 group">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to map
          </Link>

          <div className="bg-gradient-to-br from-navy to-deep-slate rounded-2xl p-6 md:p-8 border border-white/[0.06] mb-6 shadow-xl animate-slide-up">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getSeverityColor(inc.severity) + '20', border: `3px solid ${getSeverityColor(inc.severity)}` }}>
                  <span className="text-3xl font-black" style={{ color: getSeverityColor(inc.severity) }}>
                    {inc.severity}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <SeverityBadge severity={inc.severity} />
                  {inc.human_verified && (
                    <span className="text-[10px] font-semibold text-safe-green bg-safe-green/15 px-2 py-0.5 rounded">HUMAN VERIFIED</span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-glacier-white capitalize mt-2">
                  {inc.event_type.replace('_', ' ')}
                </h1>
                {inc.subtype && <p className="text-base text-cool-gray/70 mt-1">{inc.subtype}</p>}
                <div className="flex items-center gap-1.5 text-sm text-glacier-white mt-2">
                  <MapPin size={14} className="text-cool-gray/50" />
                  <span>{inc.location.name}</span>
                </div>
                <div className="text-xs font-mono text-cool-gray/40 mt-1">
                  {inc.location.lat?.toFixed(4)}, {inc.location.lng?.toFixed(4)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-5xl font-black" style={{ color: getSeverityColor(inc.severity) }}>{inc.severity}</div>
                <div className="text-sm font-semibold capitalize" style={{ color: getSeverityColor(inc.severity) }}>
                  {inc.severity_label} SEVERITY
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 space-y-6">
              <AISummaryCard
                summary={inc.summary}
                confidence={inc.ai_confidence}
                sourceCount={inc.source_count}
              />

              {inc.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {inc.stats.magnitude && (
                    <div className="bg-surface/50 rounded-xl p-4 border border-white/[0.05] card-hover">
                      <div className="text-xs text-cool-gray/60">Magnitude</div>
                      <div className="text-xl font-bold text-glacier-white">{inc.stats.magnitude}</div>
                    </div>
                  )}
                  {inc.stats.deaths != null && (
                    <div className="bg-surface/50 rounded-xl p-4 border border-white/[0.05] card-hover">
                      <div className="text-xs text-cool-gray/60">Deaths Reported</div>
                      <div className="text-xl font-bold text-crisis-red">{inc.stats.deaths.toLocaleString()}</div>
                    </div>
                  )}
                  {inc.stats.displaced != null && (
                    <div className="bg-surface/50 rounded-xl p-4 border border-white/[0.05] card-hover">
                      <div className="text-xs text-cool-gray/60">Displaced</div>
                      <div className="text-xl font-bold text-amber">{inc.stats.displaced.toLocaleString()}</div>
                    </div>
                  )}
                  {inc.stats.wind_speed && (
                    <div className="bg-surface/50 rounded-xl p-4 border border-white/[0.05] card-hover">
                      <div className="text-xs text-cool-gray/60">Wind Speed</div>
                      <div className="text-xl font-bold text-signal-blue">{inc.stats.wind_speed} km/h</div>
                    </div>
                  )}
                </div>
              )}

              <Timeline sources={inc.sources} />
              <RelatedIncidents incidentId={id} />
            </div>

            <div className="space-y-4">
              <div className="bg-surface/50 border border-white/[0.06] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/60">Actions</h3>
                <button className="w-full flex items-center gap-2 bg-status-teal/15 text-status-teal border border-status-teal/20 rounded-lg px-4 py-2.5 text-sm font-medium card-hover">
                  <Bell size={16} />
                  Alert me if this escalates
                </button>
                <button aria-label="Copy link to this incident" className="w-full flex items-center gap-2 bg-surface/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-glacier-white card-hover">
                  <Share2 size={16} className="text-cool-gray" />
                  Copy link
                </button>
                <button aria-label="Export incident as JSON" className="w-full flex items-center gap-2 bg-surface/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-glacier-white card-hover">
                  <Download size={16} className="text-cool-gray" />
                  Export as JSON
                </button>
              </div>

              <div className="bg-surface/50 border border-white/[0.06] rounded-xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/60 mb-3">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cool-gray/60">Status</span>
                    <span className="text-glacier-white capitalize">{inc.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cool-gray/60">Sources</span>
                    <span className="text-glacier-white">{inc.source_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cool-gray/60">Continent</span>
                    <span className="text-glacier-white">{inc.location.continent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cool-gray/60">Country</span>
                    <span className="text-glacier-white">{inc.location.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cool-gray/60">First seen</span>
                    <span className="text-glacier-white text-xs">{new Date(inc.first_seen).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

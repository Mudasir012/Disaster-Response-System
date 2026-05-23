import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Bell, Share2, MessageSquareShare, Download } from 'lucide-react'
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
      <div className="min-h-screen bg-deep-slate flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-crisis-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-cool-gray">Loading incident...</p>
        </div>
      </div>
    )
  }

  const inc = activeIncident

  return (
    <div className="min-h-screen bg-deep-slate">
      <Navbar />

      <div className="pt-14">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link to="/map" className="inline-flex items-center gap-1.5 text-sm text-cool-gray hover:text-glacier-white transition-colors mb-6">
            <ArrowLeft size={16} />
            Back to map
          </Link>

          <div className="bg-gradient-to-r from-navy to-deep-slate rounded-2xl p-6 md:p-8 border border-white/[0.08] mb-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getSeverityColor(inc.severity) + '30', border: `3px solid ${getSeverityColor(inc.severity)}` }}>
                  <span className="text-3xl font-black" style={{ color: getSeverityColor(inc.severity) }}>
                    {inc.severity}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <SeverityBadge severity={inc.severity} />
                  {inc.human_verified && (
                    <span className="text-[10px] font-semibold text-safe-green bg-safe-green/20 px-2 py-0.5 rounded">HUMAN VERIFIED</span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-glacier-white capitalize mt-2">
                  {inc.event_type.replace('_', ' ')}
                </h1>
                {inc.subtype && <p className="text-base text-cool-gray mt-1">{inc.subtype}</p>}
                <div className="flex items-center gap-1.5 text-sm text-glacier-white mt-2">
                  <MapPin size={14} className="text-cool-gray" />
                  <span>{inc.location.name}</span>
                </div>
                <div className="text-xs font-mono text-cool-gray/60 mt-1">
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
                    <div className="bg-surface rounded-xl p-4 border border-white/[0.06]">
                      <div className="text-xs text-cool-gray">Magnitude</div>
                      <div className="text-xl font-bold text-glacier-white">{inc.stats.magnitude}</div>
                    </div>
                  )}
                  {inc.stats.deaths != null && (
                    <div className="bg-surface rounded-xl p-4 border border-white/[0.06]">
                      <div className="text-xs text-cool-gray">Deaths Reported</div>
                      <div className="text-xl font-bold text-crisis-red">{inc.stats.deaths.toLocaleString()}</div>
                    </div>
                  )}
                  {inc.stats.displaced != null && (
                    <div className="bg-surface rounded-xl p-4 border border-white/[0.06]">
                      <div className="text-xs text-cool-gray">Displaced</div>
                      <div className="text-xl font-bold text-amber">{inc.stats.displaced.toLocaleString()}</div>
                    </div>
                  )}
                  {inc.stats.wind_speed && (
                    <div className="bg-surface rounded-xl p-4 border border-white/[0.06]">
                      <div className="text-xs text-cool-gray">Wind Speed</div>
                      <div className="text-xl font-bold text-signal-blue">{inc.stats.wind_speed} km/h</div>
                    </div>
                  )}
                </div>
              )}

              <Timeline sources={inc.sources} />
              <RelatedIncidents incidentId={id} />
            </div>

            <div className="space-y-4">
              <div className="bg-surface border border-white/[0.08] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cool-gray">Actions</h3>
                <button className="w-full flex items-center gap-2 bg-status-teal/20 text-status-teal border border-status-teal/30 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-status-teal/30 transition-colors">
                  <Bell size={16} />
                  Alert me if this escalates
                </button>
                <button className="w-full flex items-center gap-2 bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-sm text-glacier-white hover:border-white/30 transition-colors">
                  <MessageSquareShare size={16} className="text-sky-400" />
                  Share on social
                </button>
                <button className="w-full flex items-center gap-2 bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-sm text-glacier-white hover:border-white/30 transition-colors">
                  <Share2 size={16} className="text-cool-gray" />
                  Copy link
                </button>
                <button className="w-full flex items-center gap-2 bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-sm text-glacier-white hover:border-white/30 transition-colors">
                  <Download size={16} className="text-cool-gray" />
                  Export as JSON
                </button>
              </div>

              <div className="bg-surface border border-white/[0.08] rounded-xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cool-gray mb-3">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cool-gray">Status</span>
                    <span className="text-glacier-white capitalize">{inc.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cool-gray">Sources</span>
                    <span className="text-glacier-white">{inc.source_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cool-gray">Continent</span>
                    <span className="text-glacier-white">{inc.location.continent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cool-gray">Country</span>
                    <span className="text-glacier-white">{inc.location.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cool-gray">First seen</span>
                    <span className="text-glacier-white text-xs">{new Date(inc.first_seen).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

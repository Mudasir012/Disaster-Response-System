import { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { IncidentsOverTime, SeverityDistribution, TopRegions, DisasterTrend } from '../components/analytics/Charts'
import { api } from '../lib/api'
import {
  mockAnalyticsOverTime, mockSeverityDistribution,
  mockAnalyticsByRegion, mockStatsSummary,
} from '../data/mockData'
import { Activity, Globe, AlertTriangle, TrendingUp } from 'lucide-react'

const useMockData = !import.meta.env.VITE_API_URL

export default function Analytics() {
  const [range, setRange] = useState('30d')
  const [overTime, setOverTime] = useState([])
  const [severityDist, setSeverityDist] = useState([])
  const [regions, setRegions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        if (useMockData) {
          setOverTime(mockAnalyticsOverTime)
          setSeverityDist(mockSeverityDistribution)
          setRegions(mockAnalyticsByRegion)
          setSummary(mockStatsSummary)
        } else {
          const [ot, sd, rg, sm] = await Promise.all([
            api.analyticsOverTime(range),
            api.statsByType(),
            api.analyticsByRegion(),
            api.statsSummary(),
          ])
          setOverTime(ot)
          setSeverityDist(sd)
          setRegions(rg)
          setSummary(sm)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [range])

  const ranges = [
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
    { value: '90d', label: '90d' },
    { value: '1y', label: '1Y' },
  ]

  return (
    <div className="min-h-screen bg-deep-slate">
      <Navbar />
      <div className="pt-14">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-glacier-white">Analytics & Statistics</h1>
            <div className="flex items-center gap-1.5 bg-surface rounded-lg p-1 border border-white/[0.08]">
              {ranges.map((r) => (
                <button key={r.value}
                  onClick={() => setRange(r.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    range === r.value
                      ? 'bg-signal-blue text-white'
                      : 'text-cool-gray hover:text-glacier-white'
                  }`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface border border-white/[0.08] rounded-xl p-4 border-t-2 border-t-crisis-red">
              <Activity size={18} className="text-crisis-red mb-2" />
              <div className="text-2xl font-bold text-glacier-white">{summary?.total?.toLocaleString() || '—'}</div>
              <div className="text-xs text-cool-gray mt-0.5">Total Incidents</div>
            </div>
            <div className="bg-surface border border-white/[0.08] rounded-xl p-4 border-t-2 border-t-signal-blue">
              <Globe size={18} className="text-signal-blue mb-2" />
              <div className="text-2xl font-bold text-glacier-white">{summary?.most_active_region || '—'}</div>
              <div className="text-xs text-cool-gray mt-0.5">Most Active Region</div>
            </div>
            <div className="bg-surface border border-white/[0.08] rounded-xl p-4 border-t-2 border-t-amber">
              <AlertTriangle size={18} className="text-amber mb-2" />
              <div className="text-2xl font-bold text-glacier-white capitalize">{summary?.most_common_type?.replace('_', ' ') || '—'}</div>
              <div className="text-xs text-cool-gray mt-0.5">Most Common Type</div>
            </div>
            <div className="bg-surface border border-white/[0.08] rounded-xl p-4 border-t-2 border-t-ai-purple">
              <TrendingUp size={18} className="text-ai-purple mb-2" />
              <div className="text-2xl font-bold text-glacier-white">{summary?.active || '—'}</div>
              <div className="text-xs text-cool-gray mt-0.5">Currently Active</div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-crisis-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <IncidentsOverTime data={overTime} />
                <SeverityDistribution data={severityDist} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <TopRegions data={regions} />
                <DisasterTrend data={overTime} types={['earthquake', 'flood', 'wildfire', 'cyclone']} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

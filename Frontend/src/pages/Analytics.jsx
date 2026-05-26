import { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { IncidentsOverTime, SeverityDistribution, TopRegions, DisasterTrend } from '../components/analytics/Charts'
import { api } from '../lib/api'
import { mockAnalyticsOverTime, mockSeverityDistribution, mockAnalyticsByRegion, mockStatsSummary } from '../data/mockData'
import { Activity, Globe, AlertTriangle, TrendingUp } from 'lucide-react'

const useMockData = !import.meta.env.VITE_API_URL

function SkeletonCard() {
  return <div className="bg-surface/50 border border-white/[0.05] rounded-xl p-4 space-y-2"><div className="skeleton w-8 h-8 mb-2" /><div className="skeleton w-20 h-6" /><div className="skeleton w-24 h-3" /></div>
}

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
            api.severityDistribution(),
            api.analyticsByRegion(),
            api.analyticsOverview(),
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

  const statCards = [
    { icon: Activity, value: summary?.total?.toLocaleString(), label: 'Total Incidents', color: 'border-crisis-red/30', iconColor: 'text-crisis-red' },
    { icon: Globe, value: summary?.most_active_region || '—', label: 'Most Active Region', color: 'border-signal-blue/30', iconColor: 'text-signal-blue' },
    { icon: AlertTriangle, value: summary?.most_common_type?.replace('_', ' ') || '—', label: 'Most Common Type', color: 'border-amber/30', iconColor: 'text-amber' },
    { icon: TrendingUp, value: summary?.active?.toLocaleString() || '—', label: 'Currently Active', color: 'border-ai-purple/30', iconColor: 'text-ai-purple' },
  ]

  return (
    <div className="min-h-screen bg-deep-slate">
      <Navbar />
      <div className="pt-14">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-glacier-white">Analytics & Statistics</h1>
            <div className="flex items-center gap-1.5 bg-surface/50 rounded-lg p-1 border border-white/[0.06]">
              {ranges.map((r) => (
                <button key={r.value}
                  onClick={() => setRange(r.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    range === r.value
                      ? 'bg-signal-blue text-white shadow-sm'
                      : 'text-cool-gray/60 hover:text-glacier-white'
                  }`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-stagger">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : statCards.map((card) => (
                  <div key={card.label} className={`bg-surface/50 border border-white/[0.05] rounded-xl p-4 border-t-2 ${card.color} card-hover`}>
                    <card.icon size={18} className={`${card.iconColor} mb-2`} />
                    <div className="text-2xl font-bold text-glacier-white">{card.value}</div>
                    <div className="text-xs text-cool-gray/60 mt-0.5">{card.label}</div>
                  </div>
                ))
            }
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-crisis-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
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

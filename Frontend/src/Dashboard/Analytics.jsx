import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from './DashboardLayout'
import { api } from '../lib/api'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
} from 'recharts'

const easeLusion = [0.4, 0, 0.1, 1]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null
  return (
    <div className="bg-deep-slate/95 backdrop-blur-sm border border-white/[0.08] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-glacier-white font-medium">{label || payload[0].name}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-cool-gray/60" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

function ChartCard({ title, children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: easeLusion }}
      className={`bg-surface rounded-xl border border-white/[0.04] p-5 ${className || ''}`}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/50 mb-4">{title}</h3>
      {children}
    </motion.div>
  )
}

const severityColors = {
  5: { name: 'Critical', color: '#e94560' },
  4: { name: 'Severe', color: '#f43f5e' },
  3: { name: 'Moderate', color: '#d97706' },
  2: { name: 'Minor', color: '#0f7ddb' },
  1: { name: 'Info', color: '#38bdf8' },
}

const typeMap = {
  earthquake: 'Earthquake',
  flood: 'Flood',
  wildfire: 'Wildfire',
  cyclone: 'Hurricane',
  tsunami: 'Tsunami',
  severe_weather: 'Tornado',
}

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [severityDist, setSeverityDist] = useState([])
  const [typeDist, setTypeDist] = useState([])

  useEffect(() => {
    let active = true
    async function fetchData() {
      try {
        setLoading(true)
        const [summaryData, overTimeData, severityData, typeData] = await Promise.all([
          api.analyticsOverview(),
          api.analyticsOverTime('7d'),
          api.severityDistribution(),
          api.statsByType(),
        ])

        if (active) {
          setSummary(summaryData)

          // Format timeline
          const formattedTimeline = overTimeData.map((t) => {
            const d = new Date(t.date)
            const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
            return { date: formattedDate, incidents: t.count }
          })
          setTimeline(formattedTimeline)

          // Format severity distribution
          const formattedSeverity = severityData.map((s) => {
            const config = severityColors[s.severity] || { name: `Level ${s.severity}`, color: '#94a3b8' }
            return { name: config.name, value: s.count, color: config.color }
          })
          setSeverityDist(formattedSeverity)

          // Format type distribution
          const formattedType = typeData.map((typeObj) => ({
            name: typeMap[typeObj.event_type] || typeObj.event_type || 'Unknown',
            count: typeObj.count,
          }))
          setTypeDist(formattedType)
        }
      } catch (err) {
        console.error('Failed to fetch analytics data:', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-signal-blue animate-spin" />
          <span className="text-xs text-cool-gray/50">Loading analytics...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6 relative">
        {/* Cross decorations */}
        <div className="pointer-events-none absolute top-4 left-4 text-cool-gray/[0.04]"><span className="cross" /></div>
        <div className="pointer-events-none absolute top-4 right-4 text-cool-gray/[0.04]"><span className="cross" /></div>

        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: easeLusion }}
            className="font-sora text-xl font-bold text-glacier-white"
          >
            Analytics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: easeLusion }}
            className="text-sm text-cool-gray/60 mt-1"
          >
            Incident trends and distribution over the past 7 days
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Incidents Over Time" delay={0.15}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e94560" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#e94560" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="incidents" stroke="#e94560" strokeWidth={2} fill="url(#timeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Severity Distribution" delay={0.25}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={severityDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {severityDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-5 mt-2 flex-wrap">
              {severityDist.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                  <span className="text-[10px] text-cool-gray/50">{entry.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="By Incident Type" delay={0.35}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={typeDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#0f7ddb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Quick Summary" delay={0.45}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Incidents', value: summary?.total || 0, change: `+${summary?.today || 0} today`, color: '#e94560' },
                { label: 'Active Incidents', value: summary?.active || 0, change: summary?.critical > 0 ? `${summary?.critical} critical` : 'All stable', color: '#0d9488' },
                { label: 'Regions Affected', value: summary?.countries || 0, change: 'Across continents', color: '#0f7ddb' },
                { label: 'Most Common Type', value: summary?.most_common_type ? (typeMap[summary.most_common_type] || summary.most_common_type) : 'N/A', change: 'Based on raw events', color: '#16a34a' },
              ].map((stat) => (
                <div key={stat.label} className="bg-deep-slate rounded-lg p-4">
                  <p className="text-2xl font-bold text-glacier-white">{stat.value}</p>
                  <p className="text-[11px] text-cool-gray/50 mt-1">{stat.label}</p>
                  <p className="text-[10px] mt-1" style={{ color: stat.color }}>{stat.change}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  )
}


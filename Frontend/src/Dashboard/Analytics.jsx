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
    <div className="rounded-lg border border-[oklch(0.26_0.022_255/0.1)] bg-surface/95 px-3 py-2 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.15)] backdrop-blur-sm">
      <p className="font-mono text-xs font-medium text-glacier-white">{label || payload[0]?.name}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono text-xs tabular-nums" style={{ color: p.color || p.fill }}>
          {p.name !== label ? `${p.name}: ` : ''}{p.value}
        </p>
      ))}
    </div>
  )
}

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: easeLusion }}
      className="flex flex-col rounded-xl border border-[oklch(0.26_0.022_255/0.08)] bg-surface p-5"
    >
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-sora text-sm font-semibold text-glacier-white">{title}</h3>
        {subtitle && (
          <span className="font-mono text-[10px] text-cool-gray/70">{subtitle}</span>
        )}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </motion.div>
  )
}

function KpiTile({ label, value, delta, deltaKind = 'neutral', delay = 0 }) {
  const deltaColor =
    deltaKind === 'up' ? 'text-crisis-red' :
    deltaKind === 'down' ? 'text-safe-green' :
    'text-cool-gray/70'
  const arrow =
    deltaKind === 'up' ? '↑' :
    deltaKind === 'down' ? '↓' :
    '·'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, delay, ease: easeLusion }}
      className="rounded-xl border border-[oklch(0.26_0.022_255/0.08)] bg-surface p-4"
    >
      <p className="font-mono text-2xl font-bold tabular-nums text-glacier-white">{value}</p>
      <p className="mt-1 text-xs text-cool-gray/80">{label}</p>
      {delta != null && (
        <p className={`mt-1.5 font-mono text-[11px] ${deltaColor}`}>
          {arrow} {delta}
        </p>
      )}
    </motion.div>
  )
}

function Skeleton() {
  return (
    <div className="flex-1 space-y-4 p-6" aria-label="Loading analytics">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[oklch(0.26_0.022_255/0.08)] bg-surface p-4">
            <div className="mb-1 h-7 w-14 rounded bg-[oklch(0.26_0.022_255/0.06)] animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
            <div className="h-3 w-20 rounded bg-[oklch(0.26_0.022_255/0.04)] animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
            <div className="mt-1.5 h-2.5 w-16 rounded bg-[oklch(0.26_0.022_255/0.03)] animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
          </div>
        ))}
      </div>
      <div className="h-[260px] rounded-xl border border-[oklch(0.26_0.022_255/0.08)] bg-surface p-5">
        <div className="mb-4 h-4 w-32 rounded bg-[oklch(0.26_0.022_255/0.06)] animate-pulse" />
        <div className="h-44 rounded bg-[oklch(0.26_0.022_255/0.03)] animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-[260px] rounded-xl border border-[oklch(0.26_0.022_255/0.08)] bg-surface p-5">
            <div className="mb-4 h-4 w-24 rounded bg-[oklch(0.26_0.022_255/0.06)] animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
            <div className="h-44 rounded bg-[oklch(0.26_0.022_255/0.03)] animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

const severityColors = {
  5: { name: 'Critical', color: '#e94560' },
  4: { name: 'Severe', color: '#f97316' },
  3: { name: 'Moderate', color: '#d97706' },
  2: { name: 'Minor', color: '#0f7ddb' },
  1: { name: 'Info', color: '#38bdf8' },
}

const typeMap = {
  earthquake: 'Earthquake',
  flood: 'Flood',
  wildfire: 'Wildfire',
  hurricane: 'Hurricane',
  tsunami: 'Tsunami',
  tornado: 'Tornado',
  volcanic_eruption: 'Volcanic Er.',
  landslide: 'Landslide',
  cyclone: 'Hurricane',
  severe_weather: 'Tornado',
}

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [severityDist, setSeverityDist] = useState([])
  const [typeDist, setTypeDist] = useState([])

  useEffect(() => {
    let active = true
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const [summaryData, overTimeData, severityData, typeData] = await Promise.all([
          api.analyticsOverview(),
          api.analyticsOverTime('7d'),
          api.severityDistribution(),
          api.statsByType(),
        ])

        if (active) {
          setSummary(summaryData)

          const formattedTimeline = overTimeData.map((t) => {
            const d = new Date(t.date)
            return {
              date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
              incidents: t.count,
            }
          })
          setTimeline(formattedTimeline)

          const formattedSeverity = severityData
            .map((s) => {
              const config = severityColors[s.severity]
              if (!config) return null
              return { name: config.name, value: s.count, color: config.color }
            })
            .filter(Boolean)
            .sort((a, b) => b.value - a.value)
          setSeverityDist(formattedSeverity)

          const formattedType = typeData
            .map((typeObj) => ({
              name: typeMap[typeObj.event_type] || typeObj.event_type || 'Unknown',
              count: typeObj.count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
          setTypeDist(formattedType)
        }
      } catch {
        if (active) setError('Unable to load analytics. Please try again.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchData()
    return () => { active = false }
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <Skeleton />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/10">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm text-cool-gray/80">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div>
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
            className="mt-1 text-sm text-cool-gray/80"
          >
            Past 7 days &middot; {summary?.total || 0} total incidents
          </motion.p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiTile
            label="Total incidents"
            value={summary?.total?.toLocaleString() || '0'}
            delta={`${summary?.today || 0} today`}
            deltaKind="neutral"
            delay={0.1}
          />
          <KpiTile
            label="Active now"
            value={summary?.active?.toLocaleString() || '0'}
            delta={summary?.critical > 0 ? `${summary.critical} critical` : null}
            deltaKind={summary?.critical > 0 ? 'up' : 'neutral'}
            delay={0.15}
          />
          <KpiTile
            label="Regions affected"
            value={summary?.countries?.toLocaleString() || '0'}
            delta={summary?.regions_delta ? `+${summary.regions_delta} this week` : 'Across continents'}
            deltaKind="neutral"
            delay={0.2}
          />
          <KpiTile
            label="Most common"
            value={summary?.most_common_type ? (typeMap[summary.most_common_type] || summary.most_common_type) : '—'}
            delta="Based on raw events"
            deltaKind="neutral"
            delay={0.25}
          />
        </div>

        {/* Trend chart — full width */}
        <ChartCard title="Incidents Over Time" subtitle={timeline.length ? `${timeline.length} data points` : ''} delay={0.3}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={timeline}>
              <defs>
                <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e94560" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#e94560" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="incidents" stroke="#e94560" strokeWidth={2} fill="url(#timeGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Severity + Type side-by-side */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard title="Severity Distribution" delay={0.4}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={severityDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {severityDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {severityDist.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
                  <span className="font-mono text-[10px] text-cool-gray/80">{entry.name}</span>
                  <span className="font-mono text-[10px] font-semibold text-glacier-white/70">{entry.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="By Incident Type" delay={0.5}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={typeDist} layout="vertical" margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {typeDist.map((entry, i) => {
                    const hues = ['#e94560', '#f97316', '#d97706', '#0f7ddb', '#0d9488', '#7c3aed', '#16a34a', '#06b6d4', '#8b5cf6', '#64748b']
                    return <Cell key={i} fill={hues[i % hues.length]} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  )
}

import DashboardLayout from './DashboardLayout'
import { analyticsData } from './mockData'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
} from 'recharts'

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

function ChartCard({ title, children, className }) {
  return (
    <div className={`bg-surface rounded-xl border border-white/[0.04] p-5 ${className || ''}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-cool-gray/50 mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="font-sora text-xl font-bold text-glacier-white">Analytics</h1>
          <p className="text-sm text-cool-gray/60 mt-1">Incident trends and distribution over the past 7 days</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Incidents Over Time">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analyticsData.timeline}>
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

          <ChartCard title="Severity Distribution">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={analyticsData.severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {analyticsData.severityDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-5 mt-2">
              {analyticsData.severityDistribution.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                  <span className="text-[10px] text-cool-gray/50">{entry.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="By Incident Type">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analyticsData.typeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#0f7ddb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Quick Summary">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Incidents', value: '15', change: '+3 today', color: '#e94560' },
                { label: 'Active', value: '7', change: 'Requires attention', color: '#0d9488' },
                { label: 'Avg Response', value: '4.2m', change: '12% faster', color: '#0f7ddb' },
                { label: 'Sources Active', value: '6', change: 'All operational', color: '#16a34a' },
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

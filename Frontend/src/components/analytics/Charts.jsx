import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts'

const tooltipStyle = {
  contentStyle: {
    background: '#1c2333', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#f8fafc', fontSize: '12px',
  },
  labelStyle: { color: '#94a3b8' },
}

const colors = {
  earthquake: '#e94560', flood: '#0f7ddb', wildfire: '#d97706',
  cyclone: '#7c3aed', tsunami: '#0d9488', severe_weather: '#94a3b8',
}

export function IncidentsOverTime({ data }) {
  if (!data || !data.length) return null

  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-glacier-white mb-4">Incidents Over Time</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            {Object.entries(colors).map(([key, color]) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip {...tooltipStyle} />
          {Object.keys(colors).map((key) => (
            <Area key={key} type="monotone" dataKey={key} stackId="1"
              stroke={colors[key]} fill={`url(#grad-${key})`} strokeWidth={1.5} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SeverityDistribution({ data }) {
  if (!data || !data.length) return null

  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-glacier-white mb-4">Severity Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
            dataKey="count" paddingAngle={3}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend
            formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>SEV-{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TopRegions({ data }) {
  if (!data || !data.length) return null

  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-glacier-white mb-4">Top Affected Regions</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="region" tick={{ fill: '#f8fafc', fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={`hsl(${220 - i * 30}, 70%, ${50 - i * 5}%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DisasterTrend({ data, types }) {
  if (!data || !data.length) return null

  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-glacier-white mb-4">Disaster Type Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip {...tooltipStyle} />
          <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>} />
          {(types || Object.keys(colors)).map((key) => (
            <Area key={key} type="monotone" dataKey={key} stroke={colors[key]}
              fill="transparent" strokeWidth={2} dot={false} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

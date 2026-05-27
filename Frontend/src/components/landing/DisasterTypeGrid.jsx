import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Droplets, Flame, Tornado, Waves, CloudLightning, ArrowRight } from 'lucide-react'
import { useIncidentStore } from '../../store/useIncidentStore'

const disasterTypes = [
  { key: 'earthquake', icon: Activity, color: 'text-crisis-red', border: 'border-crisis-red/20' },
  { key: 'flood', icon: Droplets, color: 'text-signal-blue', border: 'border-signal-blue/20' },
  { key: 'wildfire', icon: Flame, color: 'text-amber', border: 'border-amber/20' },
  { key: 'cyclone', icon: Tornado, color: 'text-ai-purple', border: 'border-ai-purple/20' },
  { key: 'tsunami', icon: Waves, color: 'text-status-teal', border: 'border-status-teal/20' },
  { key: 'severe_weather', icon: CloudLightning, color: 'text-cool-gray', border: 'border-cool-gray/20' },
]

function DisasterCard({ dt, count }) {
  return (
    <Link
      to={`/map?type=${dt.key}`}
      className={`block glass rounded-xl p-6 text-center transition-all duration-300 hover:scale-[1.05] hover:shadow-lg group ${dt.border}`}
    >
      <dt.icon size={28} className={`${dt.color} mx-auto mb-3 transition-all duration-300 group-hover:scale-110`} />
      <div className="text-sm font-semibold text-glacier-white capitalize mb-1">{dt.key.replace('_', ' ')}</div>
      <div className={`text-2xl font-black ${dt.color} tabular-nums`}>{count}</div>
      <div className="text-[11px] text-cool-gray mt-0.5">active</div>
    </Link>
  )
}

function HighlightCard({ dt, count }) {
  return (
    <Link
      to={`/map?type=${dt.key}`}
      className={`block glass rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group md:col-span-2 md:flex md:items-center md:gap-8 ${dt.border}`}
    >
      <dt.icon size={44} className={`${dt.color} shrink-0 transition-all duration-300 group-hover:scale-110`} />
      <div className="flex-1 min-w-0">
        <div className="text-xl font-bold text-glacier-white capitalize">{dt.key.replace('_', ' ')}</div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-4xl font-black ${dt.color} tabular-nums`}>{count}</span>
          <span className="text-sm text-cool-gray">active incidents right now</span>
        </div>
      </div>
      <ArrowRight size={22} className={`${dt.color} shrink-0 transition-all duration-300 group-hover:translate-x-1`} />
    </Link>
  )
}

export default function DisasterTypeGrid() {
  const { statsByType, fetchStatsByType } = useIncidentStore()

  useEffect(() => { fetchStatsByType() }, [])

  const getCount = (key) => statsByType.find((s) => s.event_type === key)?.count || 0
  const [first, second, ...rest] = disasterTypes

  return (
    <section className="py-28 bg-deep-slate relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,_rgba(124,58,237,0.03)_0%,_transparent_60%)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-glacier-white max-w-2xl leading-tight mb-4">
          We track every type of disaster.
          <br />
          <span className="text-amber">Every corner of the world.</span>
        </h2>
        <p className="text-base md:text-lg text-cool-gray max-w-xl mb-14 leading-relaxed">
          From earthquakes to cyclones, tsunamis to wildfires. Here&apos;s what&apos;s active
          on the network right now.
        </p>

        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HighlightCard dt={first} count={getCount(first.key)} />
            <HighlightCard dt={second} count={getCount(second.key)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rest.map((dt) => (
              <DisasterCard key={dt.key} dt={dt} count={getCount(dt.key)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

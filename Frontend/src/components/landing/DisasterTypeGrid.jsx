import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Droplets, Flame, Tornado, Waves, CloudLightning } from 'lucide-react'
import { useIncidentStore } from '../../store/useIncidentStore'

const disasterTypes = [
  { key: 'earthquake', icon: Activity, color: 'text-crisis-red', border: 'border-crisis-red/30', bg: 'bg-crisis-red/10' },
  { key: 'flood', icon: Droplets, color: 'text-signal-blue', border: 'border-signal-blue/30', bg: 'bg-signal-blue/10' },
  { key: 'wildfire', icon: Flame, color: 'text-amber', border: 'border-amber/30', bg: 'bg-amber/10' },
  { key: 'cyclone', icon: Tornado, color: 'text-ai-purple', border: 'border-ai-purple/30', bg: 'bg-ai-purple/10' },
  { key: 'tsunami', icon: Waves, color: 'text-status-teal', border: 'border-status-teal/30', bg: 'bg-status-teal/10' },
  { key: 'severe_weather', icon: CloudLightning, color: 'text-cool-gray', border: 'border-cool-gray/30', bg: 'bg-cool-gray/10' },
]

export default function DisasterTypeGrid() {
  const { statsByType, fetchStatsByType } = useIncidentStore()
  const navigate = useNavigate()

  useEffect(() => { fetchStatsByType() }, [])

  const getCount = (key) => {
    const found = statsByType.find((s) => s.event_type === key)
    return found ? found.count : 0
  }

  return (
    <section className="py-20 bg-deep-slate">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-[0.12em] text-amber uppercase">What We Track</span>
          <h2 className="text-3xl md:text-4xl font-bold text-glacier-white mt-3">Every type of disaster, every corner of the world.</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {disasterTypes.map((dt) => (
            <button
              key={dt.key}
              onClick={() => navigate(`/map?type=${dt.key}`)}
              className={`${dt.bg} border ${dt.border} rounded-xl p-5 text-center transition-all duration-300 hover:scale-[1.03] hover:bg-white/5 group`}
            >
              <dt.icon size={32} className={`${dt.color} mx-auto mb-2 transition-transform group-hover:scale-110`} />
              <div className="text-sm font-semibold text-glacier-white capitalize mb-1">{dt.key.replace('_', ' ')}</div>
              <div className={`text-lg font-bold ${dt.color}`}>{getCount(dt.key)}</div>
              <div className="text-[11px] text-cool-gray mt-0.5">active</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Droplets, Flame, Tornado, Waves, CloudLightning } from 'lucide-react'
import { useIncidentStore } from '../../store/useIncidentStore'

const disasterTypes = [
  { key: 'earthquake', icon: Activity, color: 'text-crisis-red', border: 'border-crisis-red/20', bg: 'bg-crisis-red/[0.07]', hover: 'hover:bg-crisis-red/[0.12]' },
  { key: 'flood', icon: Droplets, color: 'text-signal-blue', border: 'border-signal-blue/20', bg: 'bg-signal-blue/[0.07]', hover: 'hover:bg-signal-blue/[0.12]' },
  { key: 'wildfire', icon: Flame, color: 'text-amber', border: 'border-amber/20', bg: 'bg-amber/[0.07]', hover: 'hover:bg-amber/[0.12]' },
  { key: 'cyclone', icon: Tornado, color: 'text-ai-purple', border: 'border-ai-purple/20', bg: 'bg-ai-purple/[0.07]', hover: 'hover:bg-ai-purple/[0.12]' },
  { key: 'tsunami', icon: Waves, color: 'text-status-teal', border: 'border-status-teal/20', bg: 'bg-status-teal/[0.07]', hover: 'hover:bg-status-teal/[0.12]' },
  { key: 'severe_weather', icon: CloudLightning, color: 'text-cool-gray', border: 'border-cool-gray/20', bg: 'bg-cool-gray/[0.07]', hover: 'hover:bg-cool-gray/[0.12]' },
]

export default function DisasterTypeGrid() {
  const { statsByType, fetchStatsByType } = useIncidentStore()
  const navigate = useNavigate()

  useEffect(() => { fetchStatsByType() }, [])

  const getCount = (key) => statsByType.find((s) => s.event_type === key)?.count || 0

  return (
    <section className="py-24 bg-deep-slate relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(124,58,237,0.04)_0%,_transparent_60%)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <span className="text-xs font-semibold tracking-[0.15em] text-amber uppercase">What We Track</span>
          <h2 className="text-3xl md:text-4xl font-bold text-glacier-white mt-3">Every type of disaster, every corner of the world.</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-stagger">
          {disasterTypes.map((dt) => (
            <button
              key={dt.key}
              onClick={() => navigate(`/map?type=${dt.key}`)}
              className={`${dt.bg} ${dt.hover} border ${dt.border} rounded-xl p-5 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-lg group`}
            >
              <dt.icon size={32} className={`${dt.color} mx-auto mb-2 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg`} />
              <div className="text-sm font-semibold text-glacier-white capitalize mb-1">{dt.key.replace('_', ' ')}</div>
              <div className={`text-lg font-bold ${dt.color}`}>{getCount(dt.key)}</div>
              <div className="text-[11px] text-cool-gray/60 mt-0.5">active</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

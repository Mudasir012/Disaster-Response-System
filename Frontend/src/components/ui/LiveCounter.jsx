import { useEffect, useState } from 'react'
import { Activity, Globe, AlertTriangle, Clock } from 'lucide-react'
import { useIncidentStore } from '../../store/useIncidentStore'

function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration])
  return <span className="tabular-nums">{count.toLocaleString()}</span>
}

export default function LiveCounter() {
  const { statsSummary } = useIncidentStore()
  const stats = statsSummary || { active: 0, countries: 0, today: 0, critical: 0 }

  const items = [
    { icon: Activity, value: stats.active, label: 'Active Incidents', color: 'text-crisis-red', border: 'border-crisis-red/30', bg: 'bg-crisis-red/5' },
    { icon: Globe, value: stats.countries, label: 'Countries Affected', color: 'text-signal-blue', border: 'border-signal-blue/30', bg: 'bg-signal-blue/5' },
    { icon: Clock, value: stats.today, label: 'Updates Today', color: 'text-status-teal', border: 'border-status-teal/30', bg: 'bg-status-teal/5' },
    { icon: AlertTriangle, value: stats.critical, label: 'Critical Alerts', color: 'text-amber', border: 'border-amber/30', bg: 'bg-amber/5' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
      {items.map((item) => (
        <div key={item.label}
          className={`${item.bg} backdrop-blur-sm border ${item.border} rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.02]`}>
          <item.icon size={20} className={`mx-auto mb-2 ${item.color}`} />
          <div className={`text-2xl md:text-3xl font-bold ${item.color} animate-count-up`}>
            <CountUp end={item.value} />
          </div>
          <div className="text-xs text-cool-gray mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

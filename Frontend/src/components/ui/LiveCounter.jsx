import { useEffect, useRef, useState } from 'react'
import { useIncidentStore } from '../../store/useIncidentStore'

function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const targetRef = useRef(end)
  const rafRef = useRef(null)

  useEffect(() => {
    targetRef.current = end
    if (rafRef.current) return
    let current = 0
    const step = Math.max(1, Math.ceil(end / (duration / 16)))
    const animate = () => {
      current += step
      if (current >= targetRef.current) {
        setCount(targetRef.current)
        rafRef.current = null
      } else {
        setCount(current)
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  return <span className="tabular-nums">{count.toLocaleString()}</span>
}

export default function LiveCounter() {
  const { statsSummary } = useIncidentStore()
  const stats = statsSummary || { active: 0, countries: 0, today: 0, critical: 0 }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-cool-gray/70 px-4">
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-crisis-red" />
        <span><CountUp end={stats.active} /> active</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-signal-blue" />
        <span><CountUp end={stats.countries} /> countries</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-status-teal" />
        <span><CountUp end={stats.today} /> updates today</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber" />
        <span><CountUp end={stats.critical} /> critical</span>
      </span>
    </div>
  )
}

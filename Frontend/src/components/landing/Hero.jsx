import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'
import LiveCounter from '../ui/LiveCounter'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-deep-slate">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,_#e94560_0%,_transparent_60%)]" />
      <AnimatedDots />

      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20 pb-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 bg-crisis-red/10 text-crisis-red text-xs font-semibold px-3 py-1.5 rounded-full mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-crisis-red animate-pulse-ring" />
          LIVE 24/7 MONITORING
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span className="text-glacier-white">Every disaster.</span>
          <br />
          <span className="text-crisis-red">Every second.</span>
        </h1>

        <p className="text-lg text-cool-gray max-w-2xl mb-10 leading-relaxed">
          Real-time tracking of earthquakes, floods, wildfires, cyclones and more —
          powered by live data and AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 bg-crisis-red hover:bg-crisis-red/90 text-white text-lg font-semibold px-8 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            View Live Map
            <ArrowRight size={20} />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-glacier-white text-lg font-semibold px-8 py-3 rounded-xl transition-all hover:scale-[1.02]"
          >
            <Play size={18} />
            See How It Works
          </Link>
        </div>

        <LiveCounter />
      </div>
    </section>
  )
}

function AnimatedDots() {
  const dots = Array.from({ length: 30 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.5 + 0.1,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-crisis-red animate-pulse"
          style={{
            left: d.left, top: d.top, width: d.size, height: d.size,
            opacity: d.opacity, animationDelay: d.delay, animationDuration: '3s',
          }}
        />
      ))}
    </div>
  )
}

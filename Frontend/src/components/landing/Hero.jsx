import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'
import LiveCounter from '../ui/LiveCounter'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-deep-slate">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(233,69,96,0.12)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,_rgba(15,125,219,0.06)_0%,_transparent_50%)]" />
      <AnimatedParticles />
      <GridOverlay />

      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20 pb-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 bg-crisis-red/10 text-crisis-red text-xs font-semibold px-3 py-1.5 rounded-full mb-8 animate-fade-in border border-crisis-red/20">
          <div className="w-2 h-2 rounded-full bg-crisis-red animate-pulse-ring" />
          LIVE 24/7 MONITORING
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-slide-up">
          <span className="text-glacier-white">Every disaster.</span>
          <br />
          <span className="text-gradient-red">Every second.</span>
        </h1>

        <p className="text-lg text-cool-gray/80 max-w-2xl mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.15s' }}>
          Real-time tracking of earthquakes, floods, wildfires, cyclones and more —
          powered by live data and AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link
            to="/map"
            className="group inline-flex items-center gap-2 bg-crisis-red hover:bg-crisis-red/90 text-white text-lg font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-crisis-red/25"
          >
            View Live Map
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-glacier-white text-lg font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] hover:bg-white/5"
          >
            <Play size={18} />
            See How It Works
          </Link>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.45s' }}>
          <LiveCounter />
        </div>
      </div>
    </section>
  )
}

function AnimatedParticles() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`,
    duration: `${3 + Math.random() * 4}s`,
    size: Math.random() * 3 + 1.5,
    opacity: Math.random() * 0.3 + 0.05,
    color: i % 3 === 0 ? 'bg-crisis-red' : i % 3 === 1 ? 'bg-signal-blue' : 'bg-ai-purple',
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map((d, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${d.color} animate-glow-pulse`}
          style={{
            left: d.left, top: d.top, width: d.size, height: d.size,
            opacity: d.opacity, animationDelay: d.delay, animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  )
}

function GridOverlay() {
  return (
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
  )
}

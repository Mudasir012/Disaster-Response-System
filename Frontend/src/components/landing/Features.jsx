import { Zap, Brain, Globe } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Live in under 2 seconds',
    body: 'WebSocket architecture pushes new incidents to the map instantly — no polling, no page reload. You see it as it happens.',
    accent: 'border-crisis-red/30',
    iconColor: 'text-crisis-red',
    gradient: 'from-crisis-red/10 to-transparent',
  },
  {
    icon: Brain,
    title: 'AI reads the noise',
    body: 'Claude API classifies severity (1–5), extracts locations from raw text, and writes clear summaries. Raw data becomes actionable intelligence.',
    accent: 'border-ai-purple/30',
    iconColor: 'text-ai-purple',
    gradient: 'from-ai-purple/10 to-transparent',
  },
  {
    icon: Globe,
    title: '5 official data sources',
    body: 'GDACS, USGS, NOAA, NewsAPI, and social feeds aggregated into a single unified view. Global coverage you can trust.',
    accent: 'border-signal-blue/30',
    iconColor: 'text-signal-blue',
    gradient: 'from-signal-blue/10 to-transparent',
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-deep-slate relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_rgba(15,125,219,0.03)_0%,_transparent_60%)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14 animate-slide-up">
          <span className="text-xs font-semibold tracking-[0.15em] text-signal-blue uppercase">Why Disaster Tracker</span>
          <h2 className="text-3xl md:text-4xl font-bold text-glacier-white mt-3">Built for speed, accuracy, and scale.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={f.title}
              className={`bg-gradient-to-b ${f.gradient} bg-surface/50 border ${f.accent} rounded-xl p-6 border-t-[3px] border-l-[3px] card-hover group animate-slide-up`}
              style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`${f.iconColor} mb-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg`}>
                <f.icon size={36} />
              </div>
              <h3 className="text-base font-semibold text-glacier-white mb-2">{f.title}</h3>
              <p className="text-sm text-cool-gray/80 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

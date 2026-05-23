import { Zap, Brain, Globe } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Live in under 2 seconds',
    body: 'WebSocket architecture pushes new incidents to the map instantly — no polling, no page reload. You see it as it happens.',
    accent: 'border-crisis-red',
    iconColor: 'text-crisis-red',
  },
  {
    icon: Brain,
    title: 'AI reads the noise',
    body: 'Claude API classifies severity (1–5), extracts locations from raw text, and writes clear summaries. Raw data becomes actionable intelligence.',
    accent: 'border-ai-purple',
    iconColor: 'text-ai-purple',
  },
  {
    icon: Globe,
    title: '5 official data sources',
    body: 'GDACS, USGS, NOAA, NewsAPI, and social feeds aggregated into a single unified view. Global coverage you can trust.',
    accent: 'border-signal-blue',
    iconColor: 'text-signal-blue',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-deep-slate">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-[0.12em] text-signal-blue uppercase">Why Disaster Tracker</span>
          <h2 className="text-3xl md:text-4xl font-bold text-glacier-white mt-3">Built for speed, accuracy, and scale.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title}
              className={`bg-surface border border-white/[0.08] rounded-xl p-6 ${f.accent} border-t-[3px] border-l-[3px] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 group`}>
              <f.icon size={36} className={`${f.iconColor} mb-4 transition-transform group-hover:scale-110`} />
              <h3 className="text-base font-semibold text-glacier-white mb-2">{f.title}</h3>
              <p className="text-sm text-cool-gray leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

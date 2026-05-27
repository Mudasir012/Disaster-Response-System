import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Brain, Radio, ExternalLink, Info } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { useIncidentStore } from '../store/useIncidentStore'

const dataSources = [
  { name: 'GDACS', desc: 'Global Disaster Alert and Coordination System', url: 'https://gdacs.org' },
  { name: 'USGS', desc: 'United States Geological Survey, earthquake monitoring', url: 'https://earthquake.usgs.gov' },
  { name: 'NOAA', desc: 'National Oceanic and Atmospheric Administration', url: 'https://www.weather.gov' },
  { name: 'NewsAPI', desc: 'Global news aggregator for disaster reporting', url: 'https://newsapi.org' },
  { name: 'OpenStreetMap', desc: 'Free geographic data and map tiles', url: 'https://openstreetmap.org' },
]

export default function About() {
  const { statsSummary, fetchStatsSummary } = useIncidentStore()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => { fetchStatsSummary() }, [])

  return (
    <main className="min-h-screen bg-deep-slate">
      <Navbar />
      <div className="pt-14">
        <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-glacier-white leading-tight mb-4">
              Built to keep people informed<br />when it matters most.
            </h1>
            <p className="text-base text-cool-gray/70 leading-relaxed max-w-2xl mx-auto">
              The Real-Time Disaster Response Tracker aggregates live data from government agencies,
              seismic networks, social media, and news outlets, and presents it as an interactive,
              severity-coded map updated in real time.
            </p>
          </div>

          <div className="bg-amber/8 border border-amber/20 rounded-xl p-4 mb-10 flex items-start gap-3">
            <Info size={18} className="text-amber shrink-0 mt-0.5" />
            <p className="text-sm text-amber/80">
              This platform is for informational purposes only. Do not use for emergency response
              decisions. Always follow official emergency services guidance.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-lg font-semibold text-glacier-white mb-6">How It Works</h2>
            <div className="space-y-6 relative">
              {[
                { icon: Globe, step: '1', title: 'Collect', body: 'Data from 5 authoritative sources (GDACS, USGS, NOAA, NewsAPI, social feeds) is polled every 2 minutes.' },
                { icon: Brain, step: '2', title: 'AI Analysis', body: 'Gemini 1.5 Flash classifies each event, assigns a severity score (1–5), extracts location data, and writes a plain-English summary.' },
                { icon: Radio, step: '3', title: 'Live Map', body: 'Every incident is pushed via WebSocket to the map within seconds, no page refresh required.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start animate-slide-up" style={{ animationDelay: `${parseInt(item.step) * 100}ms` }}>
                  <div className="shrink-0 w-12 h-12 rounded-full bg-signal-blue/15 border border-signal-blue/30 flex items-center justify-center">
                    <item.icon size={20} className="text-signal-blue" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-glacier-white">{item.title}</h3>
                    <p className="text-sm text-cool-gray/70 mt-1">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ai-purple/[0.06] border border-ai-purple/20 rounded-xl p-6 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold text-ai-purple bg-ai-purple/15 px-2 py-0.5 rounded">ABOUT OUR AI</span>
            </div>
            <p className="text-sm text-glacier-white leading-relaxed mb-3">
              Gemini 1.5 Flash processes incoming data to classify disaster types, assign severity scores,
              extract geographic locations from unstructured text, and generate concise summaries.
            </p>
            <ul className="text-sm text-cool-gray/70 space-y-1 list-disc list-inside">
              <li>Classification, not prediction. AI categorises what has already happened.</li>
              <li>Confidence scores below 0.7 are flagged for human review.</li>
              <li>All data links to original sources for verification.</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-semibold text-glacier-white mb-4">Data Sources</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {dataSources.map((ds) => (
                <a key={ds.name} href={ds.url} target="_blank" rel="noopener noreferrer"
                  className="bg-surface/30 border border-white/[0.06] rounded-xl p-4 card-hover group flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-glacier-white">{ds.name}</span>
                    <p className="text-xs text-cool-gray/60 mt-0.5">{ds.desc}</p>
                  </div>
                  <ExternalLink size={14} className="text-cool-gray/40 group-hover:text-glacier-white transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {statsSummary && (
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-block bg-surface/30 border border-white/[0.06] rounded-lg px-5 py-3">
                <span className="text-sm text-cool-gray/70">
                  <span className="font-bold text-glacier-white">{statsSummary.total?.toLocaleString() || '-'}</span> incidents tracked to date
                </span>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <button onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls="tech-stack-details"
              className="text-sm text-cool-gray/60 hover:text-glacier-white cursor-pointer transition-colors">
              {expanded ? 'Hide' : 'Show'} tech stack details
            </button>
            {expanded && (
              <div id="tech-stack-details" className="mt-4 bg-surface/30 border border-white/[0.06] rounded-xl p-6 text-left animate-slide-up">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Frontend', 'React + Vite, MapLibre GL, Recharts, Zustand, Tailwind CSS'],
                    ['Backend', 'Node.js + Express, Socket.io, BullMQ + Redis'],
                    ['Database', 'MongoDB + Mongoose'],
                    ['AI', 'Gemini 1.5 Flash (Google), Groq fallback'],
                    ['Geocoding', 'Nominatim (OpenStreetMap)'],
                    ['Deployment', 'Railway (backend), Vercel (frontend)'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="text-cool-gray/60">{label}:</span>{' '}
                      <span className="text-glacier-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-center pb-8">
            <Link to="/map"
              className="group inline-flex items-center gap-2 bg-crisis-red hover:bg-crisis-red/90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-crisis-red/20">
              View Live Map
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

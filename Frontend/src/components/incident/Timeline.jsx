import { Clock } from 'lucide-react'

const sourceColors = {
  gdacs: 'bg-safe-green',
  usgs: 'bg-signal-blue',
  noaa: 'bg-amber',
  newsapi: 'bg-ai-purple',
  gdelt: 'bg-sky-400',
}

const sourceLabels = {
  gdacs: 'GDACS',
  usgs: 'USGS',
  noaa: 'NOAA',
  newsapi: 'NewsAPI',
  gdelt: 'GDELT',
}

function formatTime(date) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function Timeline({ sources = [] }) {
  if (!sources || sources.length === 0) return null

  const sorted = [...sources].sort((a, b) => new Date(b.fetched_at) - new Date(a.fetched_at))

  return (
    <div className="bg-surface/50 border border-white/[0.06] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-glacier-white mb-4 flex items-center gap-2">
        <Clock size={16} className="text-cool-gray/50" />
        Source Timeline
      </h3>
      <div className="relative pl-6 space-y-0">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06]" />
        {sorted.map((src, i) => (
          <div key={i} className="relative pb-4 last:pb-0 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`absolute left-[-17px] top-1.5 w-[14px] h-[14px] rounded-full border-2 border-deep-slate ${sourceColors[src.source] || 'bg-cool-gray'}`} />
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${sourceColors[src.source] || 'bg-cool-gray'} bg-opacity-20 text-glacier-white`}>
                    {sourceLabels[src.source] || src.source}
                  </span>
                  {src.processed && <span className="text-[10px] text-status-teal/80">✓ AI processed</span>}
                </div>
                <p className="text-sm text-cool-gray/70 mt-1 line-clamp-2">{src.raw_text}</p>
              </div>
              <span className="text-[11px] text-cool-gray/40 shrink-0 whitespace-nowrap">{formatTime(src.fetched_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

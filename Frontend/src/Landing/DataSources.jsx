import { motion } from 'framer-motion'

function USGSLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <circle cx="20" cy="20" r="18" stroke="#4ade80" strokeWidth="1.5" opacity="0.3" />
      <path d="M12 28L20 8L28 28" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 22H25" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function NOAAALogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <circle cx="20" cy="20" r="18" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" />
      <path d="M20 8C20 8 14 16 14 22C14 25.3 16.7 28 20 28C23.3 28 26 25.3 26 22C26 16 20 8 20 8Z" stroke="#60a5fa" strokeWidth="1.5" />
      <path d="M18 22L20 24L22 22" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GDACSLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <circle cx="20" cy="20" r="18" stroke="#fbbf24" strokeWidth="1.5" opacity="0.3" />
      <path d="M20 10V20L26 26" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="8" stroke="#fbbf24" strokeWidth="1.5" />
    </svg>
  )
}

function GDELTLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <circle cx="20" cy="20" r="18" stroke="#a78bfa" strokeWidth="1.5" opacity="0.3" />
      <rect x="12" y="14" width="16" height="3" rx="1.5" fill="#a78bfa" opacity="0.5" />
      <rect x="12" y="21" width="12" height="3" rx="1.5" fill="#a78bfa" opacity="0.5" />
      <rect x="12" y="28" width="8" height="3" rx="1.5" fill="#a78bfa" opacity="0.5" />
    </svg>
  )
}

function ReliefWebLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <circle cx="20" cy="20" r="18" stroke="#22d3ee" strokeWidth="1.5" opacity="0.3" />
      <path d="M14 26C16 20 18 18 20 14C22 18 24 20 26 26" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 26H26" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function GeminiLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <circle cx="20" cy="20" r="18" stroke="#e94560" strokeWidth="1.5" opacity="0.3" />
      <path d="M20 8L23 17H32L25 22.5L27.5 32L20 26L12.5 32L15 22.5L8 17H17L20 8Z" stroke="#e94560" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

const iconMap = {
  USGS: USGSLogo,
  NOAA: NOAAALogo,
  GDACS: GDACSLogo,
  GDELT: GDELTLogo,
  ReliefWeb: ReliefWebLogo,
  'Google Gemini': GeminiLogo,
}

const colorMap = {
  USGS: 'from-emerald-500/20',
  NOAA: 'from-blue-400/20',
  GDACS: 'from-amber-400/20',
  GDELT: 'from-violet-400/20',
  ReliefWeb: 'from-cyan-400/20',
  'Google Gemini': 'from-crisis-red/20',
}

const sources = [
  { name: 'USGS', desc: 'Earthquake Hazards Program' },
  { name: 'NOAA', desc: 'National Hurricane Center' },
  { name: 'GDACS', desc: 'Global Disaster Alerts' },
  { name: 'GDELT', desc: 'Global News Monitor' },
  { name: 'ReliefWeb', desc: 'Humanitarian Updates' },
  { name: 'Google Gemini', desc: 'AI Classification Engine' },
]

export default function DataSources() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {sources.map((source, i) => {
        const Icon = iconMap[source.name]
        return (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="group relative bg-white/[0.03] rounded-2xl px-4 md:px-6 py-6 md:py-8 ring-1 ring-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.06] hover:ring-white/[0.12] h-full flex flex-col items-center text-center cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[source.name]} to-transparent flex items-center justify-center mb-4 ring-1 ring-white/[0.06] transition-transform duration-500 group-hover:scale-110`}>
                <Icon />
              </div>
              <span className="font-sora text-base md:text-lg font-bold text-glacier-white group-hover:text-white transition-colors duration-300">
                {source.name}
              </span>
              <span className="mt-1.5 text-xs text-cool-gray/60 group-hover:text-cool-gray/80 transition-colors duration-300 leading-relaxed">
                {source.desc}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

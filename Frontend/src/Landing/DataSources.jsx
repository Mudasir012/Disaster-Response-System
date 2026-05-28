import { motion } from 'framer-motion'

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
      {sources.map((source, i) => (
        <motion.div
          key={source.name}
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="group relative bg-white/[0.03] rounded-2xl px-6 py-8 ring-1 ring-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.06] hover:scale-[1.02] h-full flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] mb-4 ring-1 ring-white/[0.08]" />
            <span className="font-sora text-lg font-bold text-glacier-white">
              {source.name}
            </span>
            <span className="mt-1 text-xs text-cool-gray/70">
              {source.desc}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

import { motion } from 'framer-motion'
import { GlobeHemisphereWest, Brain, BellRinging } from '@phosphor-icons/react'

const easeLusion = [0.4, 0, 0.1, 1]

const steps = [
  {
    icon: GlobeHemisphereWest,
    step: '01',
    label: 'Ingest',
    title: 'Every source, unified',
    description:
      'USGS seismometers, NOAA hurricane trackers, GDACS disaster alerts, GDELT news feeds. All converge into one real-time stream. Nothing is missed.',
    accent: '#0f7ddb',
  },
  {
    icon: Brain,
    step: '02',
    label: 'Classify',
    title: 'AI that understands context',
    description:
      'Gemini analyzes each event, classifies severity, and extracts actionable intelligence. From a tremor to a landfall, it prioritizes what demands attention.',
    accent: '#7c3aed',
  },
  {
    icon: BellRinging,
    step: '03',
    label: 'Alert',
    title: 'Notifications you can trust',
    description:
      'Set severity thresholds per region and event type. Push, email, and in-app alerts fire when criteria match. No noise. No false alarms.',
    accent: '#e94560',
  },
]

function ConnectorLine({ index }) {
  return (
    <div className="pointer-events-none absolute top-1/2 hidden -translate-y-1/2 md:block" style={{ left: `calc(${(index + 1) * 33.33}% - 1.5rem)`, width: '3rem' }}>
      <motion.svg
        width="48" height="2" viewBox="0 0 48 2" fill="none"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: easeLusion }}
        style={{ transformOrigin: 'left center' }}
      >
        <path d="M0 1H48" stroke="oklch(0.26 0.022 255 / 0.12)" strokeWidth="1" strokeDasharray="4 4" />
        <motion.path
          d="M0 1H48" stroke="oklch(0.58 0.21 15 / 0.5)" strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.15, ease: easeLusion }}
        />
      </motion.svg>
      <motion.span
        className="absolute -top-1 right-0 h-1.5 w-1.5 rounded-full bg-crisis-red/60"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.8 + index * 0.15 }}
      />
    </div>
  )
}

export default function Features() {
  return (
    <div className="relative grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3">
      {steps.map((step, i) => {
        const Icon = step.icon
        return (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: easeLusion }}
            className="relative"
          >
            <div className="bento-tile group relative h-full overflow-hidden p-8">
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{ background: `linear-gradient(135deg, ${step.accent}0c, transparent 60%)` }}
              />
              <span className="relative font-mono text-[10px] font-medium tabular-nums" style={{ color: step.accent }}>
                {step.step}
              </span>

              <div
                className="relative mt-6 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110"
                style={{ background: `${step.accent}14` }}
              >
                <Icon size={22} weight="light" style={{ color: step.accent }} />
              </div>

              <span className="relative font-mono text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: step.accent }}>
                {step.label}
              </span>

              <h3 className="relative mt-2 font-sora text-xl font-bold leading-snug text-glacier-white">
                {step.title}
              </h3>

              <p className="relative mt-3 max-w-prose text-sm leading-relaxed text-cool-gray/80">
                {step.description}
              </p>
            </div>

            {i < steps.length - 1 && <ConnectorLine index={i} />}
          </motion.div>
        )
      })}
    </div>
  )
}

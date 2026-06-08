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
      'Groq analyzes each event, classifies severity, and extracts actionable intelligence. From a tremor to a landfall, it prioritizes what demands attention.',
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
    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{ left: `calc(${(index + 1) * 33.33}% - 1.5rem)`, width: '3rem' }}>
      <motion.svg
        width="48" height="2" viewBox="0 0 48 2" fill="none"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: easeLusion }}
        style={{ transformOrigin: 'left center' }}
      >
        <path d="M0 1H48" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
        <motion.path
          d="M0 1H48" stroke="rgba(233,69,96,0.4)" strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.15, ease: easeLusion }}
        />
      </motion.svg>
      <motion.span
        className="absolute -top-1 right-0 w-1.5 h-1.5 rounded-full bg-crisis-red/50"
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
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
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
            <div className="group p-[1px] bg-white/[0.04] rounded-[2rem] h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.1,1)] hover:bg-white/[0.08]">
              <div
                className="h-full rounded-[calc(2rem-1px)] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] flex flex-col relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${step.accent}08, transparent 60%)`,
                }}
              >
                <span
                  className="font-mono text-[10px] font-medium tabular-nums"
                  style={{ color: step.accent }}
                >
                  {step.step}
                </span>

                <div
                  className="flex items-center justify-center rounded-2xl w-12 h-12 mt-6 mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_24px]"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${step.accent}20, transparent 70%)`,
                    boxShadow: `0 0 0px ${step.accent}00`,
                    transitionProperty: 'transform, box-shadow',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.1, 1)',
                  }}
                >
                  <Icon size={22} weight="light" style={{ color: step.accent }} />
                </div>

                <span
                  className="font-mono text-[10px] font-medium uppercase tracking-[0.2em]"
                  style={{ color: step.accent }}
                >
                  {step.label}
                </span>

                <h3 className="mt-2 font-sora text-xl font-bold leading-snug text-glacier-white transition-colors duration-300 group-hover:text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-cool-gray/70 max-w-prose transition-colors duration-300 group-hover:text-cool-gray/80">
                  {step.description}
                </p>

                <div
                  className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${step.accent}40, transparent)`,
                  }}
                />
              </div>
            </div>

            {i < steps.length - 1 && <ConnectorLine index={i} />}
          </motion.div>
        )
      })}
    </div>
  )
}

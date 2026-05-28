import { motion } from 'framer-motion'
import { GlobeHemisphereWest, Brain, BellRinging } from '@phosphor-icons/react'

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
      'Google Gemini analyzes each event, classifies severity, and extracts actionable intelligence. From a tremor to a landfall, it prioritizes what demands attention.',
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

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
      {steps.map((step, i) => {
        const Icon = step.icon
        return (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="group p-1.5 bg-white/[0.03] rounded-[2rem] ring-1 ring-white/[0.06] h-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.05]">
              <div
                className="h-full rounded-[calc(2rem-0.375rem)] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] flex flex-col"
                style={{
                  background: `linear-gradient(135deg, ${step.accent}10, transparent 60%)`,
                }}
              >
                <span
                  className="font-mono text-[10px] font-medium tabular-nums"
                  style={{ color: step.accent }}
                >
                  {step.step}
                </span>

                <div
                  className="flex items-center justify-center rounded-2xl w-12 h-12 mt-6 mb-4"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${step.accent}15, transparent 70%)`,
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

                <h3 className="mt-2 font-sora text-xl font-bold leading-snug text-glacier-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-cool-gray/80 max-w-prose">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

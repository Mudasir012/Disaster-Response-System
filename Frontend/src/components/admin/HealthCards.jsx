import { Database, HardDrive, Radio, Cpu } from 'lucide-react'

export default function HealthCards({ health }) {
  if (!health) return null

  const cards = [
    {
      icon: Database,
      label: 'MongoDB',
      status: health.mongodb?.status === 'connected' ? 'connected' : 'error',
      detail: `Last ping: ${Math.floor((Date.now() - (health.mongodb?.last_ping || 0)) / 1000)}s ago`,
      color: health.mongodb?.status === 'connected' ? 'text-safe-green' : 'text-crisis-red',
    },
    {
      icon: HardDrive,
      label: 'Redis',
      status: health.redis?.status === 'connected' ? 'connected' : 'error',
      detail: `Queue depth: ${health.redis?.queue_depth || 0}`,
      color: health.redis?.status === 'connected' ? 'text-safe-green' : 'text-crisis-red',
    },
    {
      icon: Radio,
      label: 'Socket.io',
      status: health.socketio?.active_connections > 0 ? 'connected' : 'idle',
      detail: `${health.socketio?.active_connections || 0} active connections`,
      color: health.socketio?.active_connections > 0 ? 'text-signal-blue' : 'text-cool-gray',
    },
    {
      icon: Cpu,
      label: 'Claude API',
      status: health.claude_api?.status === 'ok' ? 'ok' : 'error',
      detail: `${health.claude_api?.last_latency_ms || 0}ms latency`,
      color: health.claude_api?.status === 'ok' ? 'text-ai-purple' : 'text-crisis-red',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-surface border border-white/[0.08] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <card.icon size={16} className={card.color} />
            <span className="text-sm font-semibold text-glacier-white">{card.label}</span>
            <div className={`ml-auto w-2 h-2 rounded-full ${
              card.status === 'connected' || card.status === 'ok' ? 'bg-safe-green' : 'bg-crisis-red'
            }`} />
          </div>
          <div className="text-[11px] text-cool-gray">{card.detail}</div>
        </div>
      ))}
    </div>
  )
}

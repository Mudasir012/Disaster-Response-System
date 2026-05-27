import { RotateCcw, Trash2 } from 'lucide-react'

export default function QueueDashboard({ queues, onRetry, onDrain }) {
  if (!queues || !queues.length) return null

  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-glacier-white">Queue Dashboard</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Queue</th>
              <th className="text-center text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Waiting</th>
              <th className="text-center text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Active</th>
              <th className="text-center text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Completed</th>
              <th className="text-center text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Failed</th>
              <th className="text-right text-[11px] text-cool-gray font-medium uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queues.map((q) => (
              <tr key={q.name} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-glacier-white font-medium">{q.name}</td>
                <td className="px-4 py-3 text-center text-cool-gray">{q.waiting}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-signal-blue">{q.active}</span>
                </td>
                <td className="px-4 py-3 text-center text-safe-green">{q.completed}</td>
                <td className="px-4 py-3 text-center">
                  <span className={q.failed > 0 ? 'text-crisis-red' : 'text-cool-gray'}>{q.failed}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onRetry?.(q.name)}
                      aria-label="Retry failed"
                      className="p-2.5 rounded text-cool-gray hover:text-glacier-white hover:bg-white/5 transition-colors">
                      <RotateCcw size={14} />
                    </button>
                    <button onClick={() => onDrain?.(q.name)}
                      aria-label="Drain queue"
                      className="p-2.5 rounded text-cool-gray hover:text-crisis-red hover:bg-crisis-red/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

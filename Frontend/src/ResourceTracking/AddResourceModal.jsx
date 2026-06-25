import { useState } from 'react'

const TYPE_OPTIONS = [
  { value: 'vehicle', label: 'Vehicle', color: '#3b82f6' },
  { value: 'ambulance', label: 'Ambulance', color: '#ef4444' },
  { value: 'personnel', label: 'Personnel', color: '#22c55e' },
  { value: 'shelter', label: 'Shelter', color: '#f59e0b' },
  { value: 'supply_point', label: 'Supply Point', color: '#8b5cf6' },
  { value: 'medical_post', label: 'Medical Post', color: '#ec4899' },
]

export default function AddResourceModal({ position, onClose, onSave }) {
  const [type, setType] = useState('vehicle')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('available')
  const [capacity, setCapacity] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await onSave({
        type,
        name: name.trim(),
        status,
        lng: position.lng,
        lat: position.lat,
        details: {
          ...(capacity && { capacity: parseInt(capacity) }),
          ...(notes && { notes }),
        },
      })
      onClose()
    } catch {
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 rounded-[2px] border border-ink/10 bg-deep-slate shadow-2xl">
        <div className="px-5 py-4 border-b border-ink/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono tracking-wide">Add Resource</h3>
          <span className="text-[10px] text-cool-gray/70 font-mono">
            {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-mono text-cool-gray/70 uppercase tracking-wider mb-1.5 block">
              Type
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[2px] border text-[11px] font-mono transition-all cursor-pointer ${
                    type === opt.value
                      ? 'text-white border-ink/20'
                      : 'text-cool-gray/70 border-ink/5 hover:text-white hover:border-ink/10'
                  }`}
                  style={{
                    background: type === opt.value ? `${opt.color}20` : 'rgba(255,255,255,0.02)',
                    borderColor: type === opt.value ? opt.color : undefined,
                  }}
                >
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: opt.color }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-cool-gray/70 uppercase tracking-wider mb-1.5 block">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ambulance Alpha-7"
              className="w-full px-3 py-2 rounded-[2px] bg-ink/[0.03] border border-ink/10 text-white text-xs font-mono
                placeholder:text-cool-gray/65 focus:outline-none focus:border-purple-500/50 transition-all"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-mono text-cool-gray/70 uppercase tracking-wider mb-1.5 block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-[2px] bg-ink/[0.03] border border-ink/10 text-white text-xs font-mono
                  focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="available" className="bg-deep-slate">Available</option>
                <option value="busy" className="bg-deep-slate">Busy</option>
                <option value="critical" className="bg-deep-slate">Critical</option>
              </select>
            </div>
            <div className="w-24">
              <label className="text-[10px] font-mono text-cool-gray/70 uppercase tracking-wider mb-1.5 block">
                Capacity
              </label>
              <input
                value={capacity}
                onChange={(e) => setCapacity(e.target.value.replace(/\D/g, ''))}
                placeholder="—"
                className="w-full px-3 py-2 rounded-[2px] bg-ink/[0.03] border border-ink/10 text-white text-xs font-mono
                  placeholder:text-cool-gray/65 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-cool-gray/70 uppercase tracking-wider mb-1.5 block">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-[2px] bg-ink/[0.03] border border-ink/10 text-white text-xs font-mono
                placeholder:text-cool-gray/65 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 rounded-[2px] text-[11px] font-mono text-cool-gray/70 border border-ink/5
                hover:text-white hover:bg-ink/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="flex-1 px-3 py-2 rounded-[2px] text-[11px] font-mono font-semibold text-on-accent
                bg-purple-500/80 hover:bg-purple-500 transition-all
                disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

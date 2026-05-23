export default function StatsCard({ icon: Icon, value, label, color = 'border-crisis-red', accent = false }) {
  return (
    <div className={`${accent ? 'bg-surface/80' : 'bg-surface'} border border-white/[0.08] rounded-xl p-4 ${color} border-t-2`}>
      {Icon && <Icon size={18} className={`${color.replace('border', 'text')} mb-2`} />}
      <div className={`text-2xl font-bold text-glacier-white`}>{value}</div>
      <div className="text-sm text-cool-gray mt-0.5">{label}</div>
    </div>
  )
}

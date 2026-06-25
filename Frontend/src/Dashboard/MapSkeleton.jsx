export default function MapSkeleton() {
  return (
    <div className="absolute inset-0 bg-deep-slate overflow-hidden" aria-label="Loading map">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-[2px] bg-ink/[0.03] animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 rounded-[2px] bg-ink/[0.04] animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-36 h-2.5 rounded bg-ink/[0.04] animate-pulse" />
            <div className="w-24 h-2 rounded bg-ink/[0.03] animate-pulse" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-center gap-1.5 bg-ink/[0.02] px-2.5 py-1.5 rounded-[2px]">
            <div className="w-2 h-2 rounded-[2px] bg-ink/[0.04] animate-pulse" />
            <div className="w-10 h-2 rounded bg-ink/[0.03] animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

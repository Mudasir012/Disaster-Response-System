export default function SidebarSkeleton() {
  return (
    <div className="w-full h-full flex flex-col" aria-label="Loading incidents">
      <div className="shrink-0 px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-center gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/[0.04] animate-pulse" />
              <div className="w-6 h-3.5 rounded bg-white/[0.04] animate-pulse" />
              <div className="w-10 h-2.5 rounded bg-white/[0.03] animate-pulse" />
            </div>
          ))}
          <div className="w-px h-6 bg-white/[0.06]" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/[0.04] animate-pulse" />
              <div className="w-5 h-3.5 rounded bg-white/[0.04] animate-pulse" />
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="w-full rounded-lg bg-white/[0.03] h-8 animate-pulse" />
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-7 w-16 rounded-full bg-white/[0.03] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-hidden px-4 pb-4 space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-lg bg-white/[0.02] p-3 space-y-2.5 animate-pulse"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 rounded-full bg-white/[0.04]" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-20 h-2.5 rounded bg-white/[0.04]" />
                  <div className="w-12 h-2 rounded bg-white/[0.03]" />
                </div>
                <div className="w-3/4 h-2 rounded bg-white/[0.03]" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 rounded bg-white/[0.03]" />
                  <div className="w-12 h-2 rounded bg-white/[0.03]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

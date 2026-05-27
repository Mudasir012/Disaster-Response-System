import { Zap, Brain, Globe } from 'lucide-react'

export default function Features() {
  return (
    <section className="py-28 bg-deep-slate relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,_rgba(15,125,219,0.03)_0%,_transparent_60%)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-glacier-white max-w-2xl leading-tight mb-4">
          Built with one thing in mind:
          <br />
          <span className="text-crisis-red">helping you see what matters.</span>
        </h2>
        <p className="text-base md:text-lg text-cool-gray max-w-xl mb-16 leading-relaxed">
          We don&apos;t build features for the sake of it. Every piece of this platform
          exists because emergency responders asked for it.
        </p>

        <div className="glass rounded-2xl p-8 md:p-10 mb-6 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-64 h-64 bg-crisis-red/[0.06] rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-crisis-red/10 flex items-center justify-center">
                  <Zap size={20} className="text-crisis-red" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-crisis-red uppercase">Speed</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-glacier-white mb-3">You see it the second it happens.</h3>
              <p className="text-sm md:text-base text-cool-gray leading-relaxed max-w-lg">
                No polling. No page refresh. Our WebSocket architecture pushes new incidents
                to your screen in under two seconds. When every second counts, you don&apos;t wait.
              </p>
            </div>
            <div className="shrink-0 text-center px-6 py-4 rounded-xl bg-crisis-red/5 border border-crisis-red/10">
              <div className="text-5xl md:text-6xl font-black text-crisis-red tabular-nums leading-none">&lt;2s</div>
              <div className="text-xs text-cool-gray mt-1.5">end-to-end latency</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 glass rounded-2xl p-8 relative overflow-hidden card-hover">
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-ai-purple/[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-ai-purple/15 flex items-center justify-center">
                  <Brain size={20} className="text-ai-purple" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-ai-purple uppercase">Intelligence</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-glacier-white mb-3">Machines sort the noise. Humans make the call.</h3>
              <p className="text-sm text-cool-gray leading-relaxed max-w-md mb-5">
                Gemini AI reads raw feeds, classifies severity from 1 to 5, extracts locations,
                and writes clear summaries. You get actionable intelligence, not a firehose.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] font-semibold bg-ai-purple/15 text-ai-purple px-3 py-1.5 rounded-full">Gemini AI</span>
                <span className="text-[11px] font-semibold bg-ai-purple/15 text-ai-purple px-3 py-1.5 rounded-full">Groq fallback</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-72 lg:w-80 glass rounded-2xl p-8 relative overflow-hidden card-hover flex flex-col justify-center shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-signal-blue/15 flex items-center justify-center">
                <Globe size={20} className="text-signal-blue" />
              </div>
              <span className="text-xs font-semibold tracking-wider text-signal-blue uppercase">Sources</span>
            </div>
            <h3 className="text-lg font-bold text-glacier-white mb-3">Four authoritative feeds. One view.</h3>
            <p className="text-sm text-cool-gray leading-relaxed mb-5">
              We aggregate GDACS, USGS, NOAA and trusted news sources so you don&apos;t have to.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] font-semibold bg-signal-blue/15 text-signal-blue px-2.5 py-1.5 rounded-full">GDACS</span>
              <span className="text-[11px] font-semibold bg-signal-blue/15 text-signal-blue px-2.5 py-1.5 rounded-full">USGS</span>
              <span className="text-[11px] font-semibold bg-signal-blue/15 text-signal-blue px-2.5 py-1.5 rounded-full">NOAA</span>
              <span className="text-[11px] font-semibold bg-signal-blue/15 text-signal-blue px-2.5 py-1.5 rounded-full">NewsAPI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

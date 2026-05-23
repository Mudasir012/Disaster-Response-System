import { RefreshCw } from 'lucide-react'

export default function AISummaryCard({ summary, confidence, sourceCount, showAdmin = false }) {
  return (
    <div className="bg-gradient-to-br from-[#1a1040] to-[#110a2e] border border-ai-purple/20 rounded-xl p-5 border-l-4 border-l-ai-purple">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-ai-purple bg-ai-purple/15 px-2 py-0.5 rounded">AI GENERATED</span>
        </div>
        {showAdmin && (
          <button className="flex items-center gap-1 text-xs text-cool-gray hover:text-glacier-white transition-colors">
            <RefreshCw size={12} />
            Regenerate
          </button>
        )}
      </div>
      <p className="text-base text-glacier-white leading-relaxed">{summary}</p>
      <div className="flex items-center gap-4 mt-3 text-xs text-cool-gray/50">
        <span>From {sourceCount} sources</span>
        {confidence && (
          <div className="flex items-center gap-1.5">
            <span>AI Confidence:</span>
            <div className="w-20 h-1.5 bg-deep-slate rounded-full overflow-hidden">
              <div className="h-full bg-ai-purple rounded-full transition-all" style={{ width: `${Math.round(confidence * 100)}%` }} />
            </div>
            <span className="text-ai-purple font-medium">{Math.round(confidence * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

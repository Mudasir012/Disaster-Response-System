import { useState, useRef, useEffect } from 'react'
import { getChatResponse, suggestedQuestions } from './mockChatResponses'
import incidentsData from './mockData'

function Message({ role, data }) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-signal-blue/15 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%]">
          <p className="text-sm text-glacier-white">{data}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 0 1 4-4z" />
            <path d="M2 22v-2c0-4 4-6 10-6s10 2 10 6v2" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-[#7c3aed]">Gemini</span>
      </div>
      <div className="bg-gradient-to-br from-[#1a1040] to-[#110a2e] rounded-2xl rounded-tl-md px-4 py-3 border border-[#7c3aed]/10">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${data.badge}20`, color: data.badge }}
          >
            {data.severity}
          </span>
        </div>
        <p className="text-sm text-glacier-white/80 leading-relaxed">{data.summary}</p>
        {data.steps && (
          <div className="mt-3 space-y-1.5">
            {data.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0"
                  style={{ background: `${data.badge}20`, color: data.badge }}
                >
                  {i + 1}
                </span>
                <span className="text-xs text-glacier-white/60 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const activeIncidents = incidentsData.filter((i) => i.status !== 'resolved')
  const context = {
    activeCount: activeIncidents.length,
    incidentTypes: [...new Set(activeIncidents.map((i) => i.type))],
  }

  const handleSend = async (text) => {
    const query = text || input
    if (!query.trim() || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', data: query }])
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700))
    const response = getChatResponse(query, context)
    setMessages((prev) => [...prev, { role: 'assistant', data: response }])
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#7c3aed] shadow-[0_4px_20px_rgba(124,58,237,0.3)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Open AI assistant"
      >
        {open ? (
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-160px)] bg-deep-slate/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 0 1 4-4z" />
                  <path d="M2 22v-2c0-4 4-6 10-6s10 2 10 6v2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-glacier-white">AI Assistant</p>
                <p className="text-[10px] text-cool-gray/40">Gemini-powered</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mb-3">
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 0 1 4-4z" />
                    <path d="M2 22v-2c0-4 4-6 10-6s10 2 10 6v2" />
                  </svg>
                </div>
                <p className="text-sm text-glacier-white font-medium mb-1">How can I help?</p>
                <p className="text-xs text-cool-gray/40 mb-4">Ask about emergencies or safety guidance</p>
                <div className="w-full space-y-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="w-full text-left px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-cool-gray/60 hover:text-glacier-white hover:bg-white/[0.06] transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <Message key={i} role={msg.role} data={msg.data} />
            ))}
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 0 1 4-4z" />
                    <path d="M2 22v-2c0-4 4-6 10-6s10 2 10 6v2" />
                  </svg>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about emergencies..."
                aria-label="Ask the AI assistant about emergencies"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-xl border border-white/[0.07] bg-surface px-4 py-2.5 text-sm text-glacier-white placeholder:text-cool-gray/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-signal-blue/40"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-[#7c3aed] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

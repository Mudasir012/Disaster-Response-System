import { useState, useCallback } from 'react'
import { notifications, STYLES } from './mockNotifications'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState(notifications)

  const unread = list.filter((n) => !n.read).length

  const markAllRead = useCallback(() => {
    setList(list.map((n) => ({ ...n, read: true })))
  }, [list])

  const handleToggle = () => {
    if (!open) setOpen(true)
    else {
      setOpen(false)
      markAllRead()
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cool-gray/60">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-crisis-red text-[8px] font-bold text-white flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={handleToggle} />
          <div className="absolute right-0 top-10 z-40 w-80 bg-deep-slate/95 backdrop-blur-xl border border-white/[0.06] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
              <p className="text-xs font-semibold text-glacier-white">Notifications</p>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-[10px] text-signal-blue hover:text-glacier-white transition-colors duration-200">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {list.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-cool-gray/40">No notifications</p>
                </div>
              ) : (
                list.map((n) => {
                  const style = STYLES[n.type] || STYLES.info
                  return (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-white/[0.02] transition-colors duration-150 ${
                        n.read ? 'opacity-60' : 'hover:bg-white/[0.02]'
                      }`}
                      style={{ background: n.read ? 'transparent' : style.bg }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: style.dot }} />
                        <div className="min-w-0">
                          <p className={`text-xs leading-relaxed ${n.read ? 'text-cool-gray/50' : 'text-glacier-white/80'}`}>
                            {n.message}
                          </p>
                          <p className="text-[10px] font-mono text-cool-gray/40 mt-1">{timeAgo(n.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

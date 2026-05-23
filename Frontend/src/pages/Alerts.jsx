import { useState } from 'react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { Bell, Plus, Trash2, Send, CheckCircle, AlertTriangle } from 'lucide-react'

const disasterTypes = ['earthquake', 'flood', 'wildfire', 'cyclone', 'tsunami', 'severe_weather']

function RuleRow({ rule, index, onChange, onDelete }) {
  return (
    <div className="bg-surface border border-white/[0.08] rounded-lg p-4 hover:border-white/20 transition-colors">
      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="text-[11px] text-cool-gray mb-1 block">Region</label>
          <select value={rule.region} onChange={(e) => onChange(index, 'region', e.target.value)}
            className="w-full bg-deep-slate border border-white/10 rounded-lg px-3 py-2 text-sm text-glacier-white focus:outline-none focus:border-signal-blue/50">
            <option value="worldwide">Worldwide</option>
            <option value="asia">Asia</option>
            <option value="africa">Africa</option>
            <option value="europe">Europe</option>
            <option value="americas">Americas</option>
            <option value="oceania">Oceania</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] text-cool-gray mb-1 block">Disaster Types</label>
          <div className="flex flex-wrap gap-1">
            {disasterTypes.map((dt) => (
              <button key={dt}
                onClick={() => {
                  const types = rule.event_types || []
                  const updated = types.includes(dt) ? types.filter((t) => t !== dt) : [...types, dt]
                  onChange(index, 'event_types', updated)
                }}
                className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                  (rule.event_types || []).includes(dt)
                    ? 'bg-signal-blue text-white'
                    : 'bg-deep-slate text-cool-gray border border-white/10'
                }`}>
                {dt.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] text-cool-gray mb-1 block">Min Severity</label>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s}
                onClick={() => onChange(index, 'min_severity', s)}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${
                  rule.min_severity === s
                    ? 'bg-crisis-red text-white'
                    : 'bg-deep-slate text-cool-gray border border-white/10'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end justify-end">
          <button onClick={() => onDelete(index)}
            className="p-2 rounded-lg text-cool-gray hover:text-crisis-red hover:bg-crisis-red/10 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Alerts() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [rules, setRules] = useState([
    { region: 'worldwide', event_types: ['earthquake'], min_severity: 4 },
  ])
  const [alertHistory] = useState([
    { title: 'M7.8 Earthquake, Turkey', severity: 5, sent: '2 hours ago', id: 'inc-001' },
    { title: 'Super Cyclone, Bay of Bengal', severity: 5, sent: '6 hours ago', id: 'inc-004' },
    { title: 'Tornado Outbreak, US Midwest', severity: 4, sent: '1 day ago', id: 'inc-006' },
  ])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  const addRule = () => {
    if (rules.length < 5) {
      setRules([...rules, { region: 'worldwide', event_types: [], min_severity: 3 }])
    }
  }

  const updateRule = (index, field, value) => {
    const updated = rules.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    setRules(updated)
  }

  const deleteRule = (index) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-deep-slate">
      <Navbar />
      <div className="pt-14">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-glacier-white mb-2">Alert Subscriptions</h1>
          <p className="text-sm text-cool-gray mb-8">Get notified when disasters happen in your chosen regions.</p>

          {!subscribed ? (
            <div className="bg-surface border border-white/[0.08] rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-glacier-white mb-4">Get disaster alerts by email</h2>
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-deep-slate border border-white/10 rounded-lg px-4 py-2.5 text-sm text-glacier-white placeholder-cool-gray focus:outline-none focus:border-signal-blue/50"
                  required />
                <button type="submit"
                  className="bg-signal-blue hover:bg-signal-blue/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] flex items-center gap-2">
                  <Bell size={16} />
                  Subscribe
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-safe-green/10 border border-safe-green/30 rounded-xl p-4 mb-8 flex items-center gap-3">
              <CheckCircle size={20} className="text-safe-green shrink-0" />
              <div>
                <p className="text-sm text-glacier-white font-medium">Subscribed!</p>
                <p className="text-xs text-cool-gray">Alerts will be sent to {email}</p>
              </div>
            </div>
          )}

          <div className="bg-surface border border-white/[0.08] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-glacier-white">Alert Rules</h2>
              {rules.length < 5 && (
                <button onClick={addRule}
                  className="flex items-center gap-1 text-sm text-signal-blue hover:text-signal-blue/80 transition-colors">
                  <Plus size={16} />
                  Add rule
                </button>
              )}
            </div>
            <div className="space-y-3">
              {rules.map((rule, i) => (
                <RuleRow key={i} rule={rule} index={i} onChange={updateRule} onDelete={deleteRule} />
              ))}
            </div>
            {rules.length === 0 && (
              <p className="text-sm text-cool-gray text-center py-6">
                No alert rules configured. Click "Add rule" to get started.
              </p>
            )}
            <button className="mt-4 text-sm text-status-teal hover:text-status-teal/80 flex items-center gap-1.5 transition-colors">
              <Send size={14} />
              Send test alert
            </button>
          </div>

          <div className="bg-surface border border-white/[0.08] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-glacier-white mb-4">Recent Alerts</h2>
            <div className="space-y-2">
              {alertHistory.map((alert, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className={`w-2 h-2 rounded-full ${alert.severity >= 5 ? 'bg-crisis-red' : 'bg-amber'}`} />
                  <div className="flex-1">
                    <div className="text-sm text-glacier-white">{alert.title}</div>
                    <div className="text-xs text-cool-gray">Sent {alert.sent}</div>
                  </div>
                  <span className="text-xs text-cool-gray font-mono">SEV-{alert.severity}</span>
                  <a href={`/incident/${alert.id}`} className="text-xs text-signal-blue hover:underline">View</a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-white/[0.08] rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-glacier-white mb-4">Notification Channels</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-deep-slate border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-glacier-white">Email</span>
                </div>
                <span className="text-xs text-safe-green bg-safe-green/20 px-2 py-0.5 rounded">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-deep-slate border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-glacier-white">Browser Push</span>
                </div>
                <button className="text-xs text-signal-blue hover:underline">Enable</button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-deep-slate border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-glacier-white">Slack Webhook</span>
                </div>
                <input type="text" placeholder="Enter webhook URL"
                  className="bg-surface border border-white/10 rounded px-3 py-1 text-xs text-glacier-white placeholder-cool-gray focus:outline-none focus:border-signal-blue/50 w-48" />
              </div>
            </div>
          </div>

          <div className="text-center pb-8">
            <button className="text-sm text-crisis-red hover:text-crisis-red/80 transition-colors flex items-center gap-1.5 mx-auto">
              <AlertTriangle size={14} />
              Unsubscribe all
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (email === 'admin' && password === 'admin') {
      document.cookie = 'admin_token=demo_token; path=/; max-age=28800'
      navigate('/admin')
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen bg-deep-slate flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <ShieldAlert size={40} className="text-amber mx-auto mb-3" />
          <h1 className="text-xl font-bold text-glacier-white">Admin Login</h1>
          <p className="text-sm text-cool-gray mt-1">Operator access only</p>
        </div>

        <form onSubmit={handleLogin} className="bg-surface border border-white/[0.08] rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-crisis-red/10 border border-crisis-red/30 rounded-lg px-4 py-2 text-xs text-crisis-red">
              Invalid credentials. Try admin/admin
            </div>
          )}
          <div>
            <label className="text-xs text-cool-gray mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-deep-slate border border-white/10 rounded-lg px-3 py-2 text-sm text-glacier-white focus:outline-none focus:border-signal-blue/50"
              required />
          </div>
          <div>
            <label className="text-xs text-cool-gray mb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-deep-slate border border-white/10 rounded-lg px-3 py-2 text-sm text-glacier-white focus:outline-none focus:border-signal-blue/50"
              required />
          </div>
          <button type="submit"
            className="w-full bg-amber hover:bg-amber/90 text-white font-semibold py-2.5 rounded-lg transition-all text-sm">
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [inviteCode, setInviteCode] = useState(() => {
    return new URLSearchParams(window.location.search).get('ref') || ''
  })
  const navigate = useNavigate()
  const toast = useToast()

  React.useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        if (data.ip) localStorage.setItem('de_public_ip', data.ip)
      })
      .catch(e => console.error('IP fetch failed', e))
  }, [])

  async function handleAuth(e) {
    e.preventDefault()
    try {
      let r;
      if (isLogin) {
        r = await api.login({ email: phone, password })
      } else {
        r = await api.signup({ name, email: phone, phone, password, referral: inviteCode })
      }

      if (r.error) { toast.show(r.error, 'error'); return }

      if (r.token && r.user) {
        localStorage.setItem('de_token', r.token)
        localStorage.setItem('de_user', JSON.stringify(r.user))
        api.setToken(r.token)
        toast.show(`Access granted. Interface synchronized.`, 'success')
        navigate('/dashboard')
        window.location.reload()
      }
    } catch (e) { toast.show('Auth connection failed.', 'error') }
  }

  return (
    <div className="animate-premium-in min-h-[80vh] flex items-center justify-center py-20">
      <div className="auth-card">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-accent rounded-2xl mx-auto flex-center text-white text-3xl font-black mb-6 accent-glow">PS</div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-text-dim text-sm mt-2">{isLogin ? 'Sign in to your account' : 'Register to start earning'}</p>
        </div>

        <form className="premium-form" onSubmit={handleAuth}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="03XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label>Referral Code (Optional)</label>
              <input placeholder="Enter code if any" value={inviteCode} onChange={e => setInviteCode(e.target.value)} />
            </div>
          )}

          <button className="btn-premium py-4 mt-6 w-full text-sm font-bold tracking-widest">
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="text-center mt-8">
          <button
            className="btn-outline-premium w-full py-3 text-xs font-bold uppercase tracking-widest transition-all"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useToast } from '../components/Toast'
import copyToClipboard from '../utils/clipboard'
import TeamStats from '../components/TeamStats'

export default function Profile() {
  const toast = useToast()
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('de_user')
    return saved ? JSON.parse(saved) : null
  })
  const [name, setName] = useState(user?.name || '')
  const [payoutName, setPayoutName] = useState(user?.payoutName || '')
  const [payoutMethod, setPayoutMethod] = useState(user?.payoutMethod || 'JazzCash')
  const [payoutAccount, setPayoutAccount] = useState(user?.payoutAccount || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const meRes = await api.me()
        if (meRes.user) {
          setUser(meRes.user)
          setName(meRes.user.name || '')
          setPayoutName(meRes.user.payoutName || '')
          setPayoutMethod(meRes.user.payoutMethod || 'JazzCash')
          setPayoutAccount(meRes.user.payoutAccount || '')
          localStorage.setItem('de_user', JSON.stringify(meRes.user))
        }
      } catch (e) {
        console.error('Failed to load profile', e)
      }
    }
    load()
  }, [])

  async function handleUpdate(e) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const r = await api.updateMe({ name, payoutName, payoutMethod, payoutAccount })
      if (r.error) { toast.show(r.error, 'error'); return }
      toast.show('Identity protocols updated successfully.', 'success')
      const me = await api.me()
      if (me.user) {
        setUser(me.user)
        localStorage.setItem('de_user', JSON.stringify(me.user))
        window.dispatchEvent(new CustomEvent('userUpdate', { detail: me.user }))
      }
    } catch (e) {
      toast.show('Update failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="p-20 text-center text-text-dim">Initialising access...</div>

  return (
    <div className="animate-premium-in space-y-12">
      <div>
        <h1 className="section-title">My Profile</h1>
        <p className="text-text-secondary">Update your personal information and withdrawal details.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <i className="ri-user-settings-line text-accent"></i> Withdrawal Details
            </h3>
            <form className="premium-form" onSubmit={handleUpdate}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="form-group">
                  <label>Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Account Holder Name</label>
                  <input value={payoutName} onChange={e => setPayoutName(e.target.value)} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="form-group">
                  <label>Withdrawal Method</label>
                  <select value={payoutMethod} onChange={e => setPayoutMethod(e.target.value)}>
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input value={payoutAccount} onChange={e => setPayoutAccount(e.target.value)} />
                </div>
              </div>
              <div className="pt-4">
                <button className="btn-premium w-full md:w-auto px-12 py-4">Save Profile</button>
              </div>
            </form>
          </div>

          <div className="animate-premium-in space-y-8">
            <div className="glass-card p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-accent/20 to-blue-500/20"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-black border-4 border-accent mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-accent shadow-xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <div className="text-text-secondary mb-6">{user.email}</div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-text-dim uppercase font-bold mb-1">Status</div>
                    <div className="text-accent font-bold">Active</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-text-dim uppercase font-bold mb-1">Member Since</div>
                    <div className="text-white font-bold">{user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 h-fit border-l-4 border-l-accent">
              <h4 className="font-bold text-sm mb-2">Notice</h4>
              <p className="text-xs text-text-secondary leading-relaxed">Please make sure your withdrawal details are 100% correct. We are not responsible for funds sent to wrong accounts.</p>
            </div>
          </div>

          {/* Team Statistics Section */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="ri-team-line text-accent"></i> Team Statistics
            </h3>
            <TeamStats userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useToast } from '../components/Toast'

export default function Dashboard() {
  const toast = useToast()
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('de_user')
    return saved ? JSON.parse(saved) : null
  })
  const [userPackages, setUserPackages] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('de_token')
        if (token) {
          const r = await api.me()
          if (r.user) {
            setUser(r.user)
            localStorage.setItem('de_user', JSON.stringify(r.user))
            window.dispatchEvent(new CustomEvent('userUpdate', { detail: r.user }))
          }
          const pkgs = await api.getUserPackages()
          if (pkgs.userPackages) setUserPackages(pkgs.userPackages)
        }
      } catch (e) { console.error('Failed to load user data', e) }
    }
    load()

    const onUserUpdate = (e) => { if (e.detail) setUser(e.detail) }
    window.addEventListener('userUpdate', onUserUpdate)
    return () => window.removeEventListener('userUpdate', onUserUpdate)
  }, [])

  // Activity Feed
  const [events, setEvents] = useState([])
  useEffect(() => {
    async function loadEvents() {
      try {
        const r = await api.getEvents()
        if (r.events) setEvents(r.events)
      } catch (e) { }
    }
    loadEvents()
  }, [])

  async function claimFor(upId) {
    try {
      const r = await api.claimPackage(upId)
      if (r.error) { toast.show(r.error, 'error'); return }
      toast.show('Profit claimed successfully!', 'success')
      const me = await api.me()
      if (me.user) {
        localStorage.setItem('de_user', JSON.stringify(me.user))
        setUser(me.user)
        window.dispatchEvent(new CustomEvent('userUpdate', { detail: me.user }))
      }
      const pkgs = await api.getUserPackages()
      if (pkgs.userPackages) setUserPackages(pkgs.userPackages)
    } catch (e) { toast.show('Failed to claim profit', 'error') }
  }

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center p-20 glass-card">
        <h2 className="text-2xl font-bold mb-4">Account Locked</h2>
        <p className="text-text-secondary mb-8">Please activate your account by adding funds and buying a plan.</p>
        <Link to="/deposit" className="btn-premium py-4 px-12">Activate Account Now</Link>
      </div>
    </div>
  )

  return (
    <div className="animate-premium-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="section-title">Earnings Dashboard</h1>
          <p className="text-text-secondary">Account Status: <span className="text-accent font-bold">Active</span> | System Version: <span className="text-white">v4.2.0</span></p>
        </div>
        <div className="flex gap-4">
          <Link to="/deposit" className="btn-outline-premium py-2 text-sm"><i className="ri-add-circle-line"></i> Add Funds</Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <i className="ri-wallet-3-line stat-icon"></i>
          <span className="stat-label">Total Balance</span>
          <div className="stat-value">Rs {user.wallet?.toFixed(2) || '0.00'}</div>
          <div className="mt-2 text-[10px] text-accent font-bold uppercase tracking-widest">Withdrawal Ready</div>
        </div>

        <div className="stat-card">
          <i className="ri-funds-line stat-icon"></i>
          <span className="stat-label">Total Investment</span>
          <div className="stat-value">Rs {userPackages.reduce((acc, p) => acc + (p.Package?.price || 0), 0)}</div>
          <div className="mt-2 text-[10px] text-text-secondary font-bold uppercase tracking-widest">{userPackages.length} Active Plans</div>
        </div>

        <div className="stat-card">
          <i className="ri-team-line stat-icon"></i>
          <span className="stat-label">Team Members</span>
          <div className="stat-value">{user.referralCount || 0} People</div>
          <div className="mt-2 text-[10px] text-text-secondary font-bold uppercase tracking-widest">My Network</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="ri-cpu-line text-accent"></i> My Active Plans
          </h3>

          {userPackages.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-text-secondary mb-6">You don't have any active plans. Start investing to earn daily profit.</p>
              <Link to="/packages" className="btn-premium py-2">View Plans</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userPackages.map(up => (
                <div key={up.id} className="glass-card p-6 border-l-4 border-accent flex flex-col md:flex-row justify-between items-center gap-6 group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-3xl group-hover:scale-110 transition-transform">
                      <i className="ri-instance-line"></i>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{up.Package?.name}</div>
                      <div className="text-xs text-text-secondary uppercase font-bold tracking-widest">Daily Profit: Rs {up.Package?.dailyClaim}</div>
                    </div>
                  </div>

                  <div className="text-right w-full md:w-auto">
                    <button
                      className="btn-premium w-full md:w-auto text-xs py-3 px-8"
                      onClick={() => claimFor(up.id)}
                    >
                      Claim {up.Package?.name} Profit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="ri-notification-3-line text-accent"></i> Recent Activity
          </h3>
          <div className="glass-card p-6 space-y-4 mb-8">
            {events.length === 0 ? (
              <div className="text-center text-text-dim text-xs py-4">No recent activity</div>
            ) : events.slice(0, 5).map((ev, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-accent">
                <div className="w-2 h-2 mt-2 rounded-full bg-accent/50"></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10">{ev.type}</span>
                  </div>
                  <p className="text-xs text-text-primary leading-tight">{ev.description || 'Activity recorded'}</p>
                  <span className="text-[10px] text-text-dim uppercase tracking-tighter">{new Date(ev.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-6 bg-accent/5 border-accent/20 mb-8">
            <h4 className="font-bold text-sm mb-2">Notice</h4>
            <p className="text-xs text-text-secondary leading-relaxed">Please make sure your withdrawal details are correct in <strong>Profile</strong> to avoid any delay in payments.</p>
          </div>

          <div className="glass-card p-6 border-accent/20">
            <h4 className="font-bold text-base mb-6 text-white">Official Support</h4>
            <div className="flex flex-col gap-4">

              <a
                href="https://t.me/profitablesource_offical_service"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card group"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textDecoration: 'none',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <i className="ri-telegram-fill text-2xl" style={{ color: '#0088cc' }}></i>
                <div className="contact-info">
                  <div className="contact-label font-bold text-base">Telegram</div>
                  <div className="contact-value text-sm text-gray-400">Official Service</div>
                </div>
              </a>

              <a
                href="https://whatsapp.com/channel/0029VbBiOW9Dp2QC0PlpvB3V"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card group"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textDecoration: 'none',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <i className="ri-whatsapp-fill text-2xl" style={{ color: '#25D366' }}></i>
                <div className="contact-info">
                  <div className="contact-label font-bold text-base">WhatsApp</div>
                  <div className="contact-value text-sm text-gray-400">Official Channel</div>
                </div>
              </a>

              <a
                href="/downloads/profitable_source.apk"
                download
                className="contact-card group"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textDecoration: 'none',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <i className="ri-download-cloud-fill text-2xl text-accent"></i>
                <div className="contact-info">
                  <div className="contact-label font-bold text-base">Download App</div>
                  <div className="contact-value text-sm text-gray-400">Mobile Experience</div>
                </div>
              </a>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

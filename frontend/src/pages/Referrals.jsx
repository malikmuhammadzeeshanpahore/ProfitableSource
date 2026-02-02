import React, { useState, useEffect } from 'react'
import api from '../services/api'
import copyToClipboard from '../utils/clipboard'
import { useToast } from '../components/Toast'

export default function Referrals() {
  const toast = useToast()
  const [user, setUser] = useState({})
  const [stats, setStats] = useState({ levels: { total: 0, level1: 0, level2: 0, level3: 0 }, teamInvestment: 0, referralEarnings: 0 })

  useEffect(() => {
    async function load() {
      try {
        const u = JSON.parse(localStorage.getItem('de_user'))
        if (u) setUser(u)
        const s = await api.getReferralStats()
        if (s.levels) setStats(s)
      } catch (e) { console.error('Failed to load referral stats', e) }
    }
    load()
  }, [])

  const inviteLink = `${window.location.origin}/auth?tab=signup&ref=${user.inviteCode}`

  return (
    <div className="animate-premium-in space-y-12">
      <div>
        <h1 className="section-title">Invite & Earn</h1>
        <p className="text-text-secondary">Invite your friends and family to join Profitable Source and earn daily commission.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl"><i className="ri-share-line"></i></div>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <i className="ri-fingerprint-line text-accent"></i> My Referral ID
            </h3>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
              <div className="text-[10px] text-text-dim uppercase font-bold tracking-widest mb-1">Your Referral Code</div>
              <div className="text-4xl font-black text-white tracking-widest">{user.inviteCode || 'N/A'}</div>
            </div>
            <button className="btn-premium w-full py-4 text-xs font-bold" onClick={() => { copyToClipboard(user.inviteCode); toast.show('Code copied', 'success') }}>COPY MY CODE</button>
          </div>

          <div className="glass-card p-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="ri-links-line text-accent"></i> Referral Link
            </h3>
            <div className="p-4 bg-white/5 rounded-xl truncate text-xs text-text-dim font-mono mb-8 border border-white/5">
              {inviteLink}
            </div>
            <button className="btn-outline-premium w-full py-4 text-xs font-bold" onClick={() => { copyToClipboard(inviteLink); toast.show('Link copied', 'success') }}>COPY INVITE LINK</button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-10 border-l-4 border-l-accent">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <i className="ri-medal-line text-accent"></i> Commission Levels
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Level 1: Direct', rate: '10%', desc: 'Commission on people you invite directly' },
                { label: 'Level 2: Team', rate: '5%', desc: 'Commission on people invited by your team' },
                { label: 'Level 3: Extra', rate: '2%', desc: 'Passive commission from extended team' }
              ].map((tier, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{tier.label}</div>
                    <div className="text-[10px] text-text-dim uppercase font-bold">{tier.desc}</div>
                  </div>
                  <div className="text-2xl font-black text-accent">{tier.rate}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10">
            <h4 className="font-bold mb-4">Earning Rules</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li className="flex gap-3"><i className="ri-check-line text-accent"></i> Level 1: Earn 10% commission on every investment.</li>
              <li className="flex gap-3"><i className="ri-check-line text-accent"></i> Level 2: Get 5% from your team members.</li>
              <li className="flex gap-3"><i className="ri-check-line text-accent"></i> Level 3: Receive 2% passive income.</li>
              <li className="flex gap-3"><i className="ri-check-line text-accent"></i> Commissions are credited instantly to your wallet.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <i className="ri-team-line stat-icon"></i>
          <span className="stat-label">Direct Team</span>
          <div className="stat-value">{stats.levels.level1} Users</div>
        </div>
        <div className="stat-card">
          <i className="ri-funds-line stat-icon"></i>
          <span className="stat-label">Total Commission</span>
          <div className="stat-value">Rs {stats.referralEarnings?.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <i className="ri-group-line stat-icon"></i>
          <span className="stat-label">Total Sub-Team</span>
          <div className="stat-value">{stats.levels.total - stats.levels.level1} Users</div>
        </div>
      </div>
    </div>
  )
}

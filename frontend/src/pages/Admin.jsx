import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useToast } from '../components/Toast'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [deposits, setDeposits] = useState([])
  const [withdraws, setWithdraws] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [packages, setPackages] = useState([])

  // Forms state
  const [bonusAmount, setBonusAmount] = useState('')
  const [bonusUserId, setBonusUserId] = useState('')
  const [manualPkgId, setManualPkgId] = useState('')
  const [manualUserId, setManualUserId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const toast = useToast()

  const adm = (() => {
    const saved = localStorage.getItem('de_user')
    return saved ? JSON.parse(saved) : null
  })()

  if (!adm || adm.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-12 text-center">
          <i className="ri-lock-2-line text-accent text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold">Admin Access Restricted</h2>
          <p className="text-text-secondary mt-2">Please sign in with an administrative account.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadData()
    loadPackages()
  }, [activeTab])

  async function syncAdmin() {
    try {
      const r = await api.me()
      if (r.user) {
        localStorage.setItem('de_user', JSON.stringify(r.user))
        window.dispatchEvent(new CustomEvent('userUpdate', { detail: r.user }))
      }
    } catch (e) { }
  }

  async function loadData() {
    setLoading(true)
    try {
      api.setToken(localStorage.getItem('de_token'))
      if (activeTab === 'users') {
        const r = await api.adminGetUsers()
        if (r.users) setUsers(r.users)
      } else if (activeTab === 'deposits') {
        const r = await api.adminGetDeposits()
        if (r.deposits) setDeposits(r.deposits)
      } else if (activeTab === 'withdraws') {
        const r = await api.adminGetWithdraws()
        if (r.withdraws) setWithdraws(r.withdraws)
      } else if (activeTab === 'activity') {
        const r = await api.adminGetEvents(100)
        if (r.events) setEvents(r.events)
      }
      syncAdmin()
    } catch (e) {
      toast.show('Failed to fetch admin power', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function loadPackages() {
    try {
      const r = await api.getPackages()
      if (r.packages) setPackages(r.packages)
    } catch (e) { }
  }

  // Handlers
  async function handleApproveDeposit(id) {
    try {
      const r = await api.adminApproveDeposit(id)
      if (r.error) throw new Error(r.error)
      toast.show('Deposit approved successfully', 'success')
      loadData()
    } catch (e) { toast.show(e.message || 'Approval failed', 'error') }
  }

  async function handleRejectDeposit(id) {
    try {
      const r = await api.adminRejectDeposit(id)
      if (r.error) throw new Error(r.error)
      toast.show('Deposit rejected', 'info')
      loadData()
    } catch (e) { toast.show('Rejection failed', 'error') }
  }

  async function handleApproveWithdraw(id) {
    try {
      const r = await api.adminApproveWithdraw(id)
      if (r.error) throw new Error(r.error)
      toast.show('Withdrawal marked as approved', 'success')
      loadData()
    } catch (e) { toast.show('failed', 'error') }
  }

  async function handleRejectWithdraw(id) {
    try {
      const r = await api.adminRejectWithdraw(id)
      if (r.error) throw new Error(r.error)
      toast.show('Withdrawal rejected and refunded', 'info')
      loadData()
    } catch (e) { toast.show('failed', 'error') }
  }

  async function handleBanUser(userId) {
    if (!confirm('Are you sure you want to ban this user?')) return
    try {
      const r = await api.adminBanUser(userId)
      if (r.error) throw new Error(r.error)
      toast.show('User banned', 'success')
      loadData()
    } catch (e) { toast.show('Failed', 'error') }
  }

  async function handleUnbanUser(userId) {
    try {
      const r = await api.adminUnbanUser(userId)
      if (r.error) throw new Error(r.error)
      toast.show('User unbanned', 'success')
      loadData()
    } catch (e) { toast.show('Failed', 'error') }
  }

  async function handleDeleteUser(userId) {
    if (!confirm('CRITICAL: Delete this user and all their records permanently?')) return
    try {
      const r = await api.adminDeleteUser(userId)
      if (r.error) throw new Error(r.error)
      toast.show('User deleted permanently', 'success')
      loadData()
    } catch (e) { toast.show('Deletion failed', 'error') }
  }

  async function handlePromoteUser(userId) {
    if (!confirm('Security Alert: Promote this user to ADMIN? They will have full access.')) return
    try {
      const r = await api.adminPromoteUser(userId)
      if (r.error) throw new Error(r.error)
      toast.show('User promoted to Admin', 'success')
      loadData()
    } catch (e) { toast.show('Promotion failed', 'error') }
  }

  async function handleSendBonus(e) {
    e.preventDefault()
    if (!bonusUserId || !bonusAmount) return
    try {
      toast.show(`Bonus of Rs ${bonusAmount} sent!`, 'success')
      setBonusAmount(''); setBonusUserId('')
      await loadData()
      await syncAdmin()
    } catch (e) { toast.show('Bonus failed', 'error') }
  }

  async function handleManualActivate(e) {
    e.preventDefault()
    if (!manualUserId || !manualPkgId) return
    try {
      const r = await api.adminManualActivatePackage(manualUserId, manualPkgId)
      if (r.error) throw new Error(r.error)
      toast.show('Package activated for user!', 'success')
      setManualUserId(''); setManualPkgId('')
      loadData()
    } catch (e) { toast.show('Activation failed', 'error') }
  }

  return (
    <div className="animate-premium-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="section-title">Admin Command Center</h1>
          <p className="text-text-secondary text-sm">Overseeing system liquidity and user operations.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto whitespace-nowrap w-full max-w-full md:w-auto">
          {['users', 'deposits', 'withdraws', 'actions', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'users' && (
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <input
                placeholder="Search users by name, email or phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User Details</th>
                    <th>Wallet</th>
                    <th>Status</th>
                    <th>Account</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u =>
                    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.phone?.includes(searchTerm)
                  ).map(u => (
                    <tr key={u.id}>
                      <td className="p-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-text-dim">{u.phone || u.email}</div>
                        <div className="text-[9px] text-accent/60 font-mono mt-1">Reg IP: {u.signupIp || '0.0.0.0'}</div>
                      </td>
                      <td className="p-4 font-mono text-accent">Rs {u.wallet?.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${u.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {u.isActive ? 'ACTIVE' : 'BANNED'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-[10px] uppercase font-bold text-text-secondary">{u.payoutMethod || 'None'}</div>
                        <div className="text-[9px] text-text-dim">{u.payoutAccount || 'Not set'}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {u.isActive ? (
                            <button
                              onClick={() => handleBanUser(u.id)}
                              className="btn-admin-action btn-admin-ban"
                              title="Ban User"
                            >
                              <i className="ri-prohibit-line"></i>
                              <span>BAN</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnbanUser(u.id)}
                              className="btn-admin-action btn-admin-unban"
                              title="Unban User"
                            >
                              <i className="ri-checkbox-circle-line"></i>
                              <span>UNBAN</span>
                            </button>
                          )}
                          {!u.role?.includes('admin') && (
                            <button
                              onClick={() => handlePromoteUser(u.id)}
                              className="btn-admin-action text-blue-400 hover:bg-blue-400/10"
                              title="Make Admin"
                            >
                              <i className="ri-shield-user-line"></i>
                              <span>ADMIN</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="btn-admin-action btn-admin-delete"
                            title="Delete Permanent"
                          >
                            <i className="ri-delete-bin-line"></i>
                            <span>DELETE</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="glass-card p-0 overflow-hidden">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Method/TID</th>
                    <th className="text-right">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map(d => (
                    <tr key={d.id}>
                      <td className="p-4">
                        <div className="font-bold text-white">{d.User?.name}</div>
                        <div className="text-[10px] text-text-dim">{d.User?.phone}</div>
                      </td>
                      <td className="p-4 font-bold text-green-500">Rs {d.amount}</td>
                      <td className="p-4">
                        <div className="text-[10px] uppercase font-bold">{d.method}</div>
                        <div className="text-[10px] text-accent font-mono">TID: {d.transactionId}</div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleApproveDeposit(d.id)} className="btn-premium py-2 px-4 text-[10px]">Approve</button>
                        <button onClick={() => handleRejectDeposit(d.id)} className="btn-outline-premium py-2 px-4 text-[10px] border-red-500/50 text-red-500 hover:bg-red-500">Reject</button>
                      </td>
                    </tr>
                  ))}
                  {deposits.length === 0 && <tr><td colSpan="4" className="p-12 text-center text-text-dim">No pending injection requests.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'withdraws' && (
          <div className="glass-card p-0 overflow-hidden">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Gross/Fee/Net</th>
                    <th>Payout Detail</th>
                    <th className="text-right">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {withdraws.map(w => {
                    const meta = typeof w.meta === 'string' ? JSON.parse(w.meta) : (w.meta || {})
                    const user = w.User || {}
                    return (
                      <tr key={w.id} className="hover:bg-white/5">
                        <td className="p-4">
                          <div className="font-bold text-white">{user.name || 'Unknown'}</div>
                          <div className="text-[10px] text-text-dim">{user.phone || user.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-bold">Rs {w.amount?.toFixed(2)}</div>
                          <div className="text-[9px] text-accent">Fee (10%): Rs {meta.fee || (w.amount * 0.1).toFixed(2)}</div>
                          <div className="text-[9px] text-text-dim">Net: Rs {meta.net || (w.amount * 0.9).toFixed(2)}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-[10px] uppercase font-bold text-accent">{meta.payoutMethod || user.payoutMethod || 'N/A'}</div>
                          <div className="text-[11px] font-mono whitespace-nowrap">{meta.payoutAccount || user.payoutAccount || 'N/A'}</div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleApproveWithdraw(w.id)} className="btn-premium py-2 px-4 text-[10px]">Approve</button>
                          <button onClick={() => handleRejectWithdraw(w.id)} className="btn-outline-premium py-2 px-4 text-[10px] border-red-500/50 text-red-500 hover:bg-red-500">Reject</button>
                        </td>
                      </tr>
                    )
                  })}
                  {withdraws.length === 0 && <tr><td colSpan="4" className="p-12 text-center text-text-dim">No pending liquidation requests.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h3 className="font-bold mb-6 flex items-center gap-2"><i className="ri-coins-line text-accent"></i> Manual Bonus</h3>
              <form onSubmit={handleSendBonus} className="premium-form">
                <div className="form-group">
                  <label>User ID (Phone/Email)</label>
                  <input placeholder="Enter user uniquely" value={bonusUserId} onChange={e => setBonusUserId(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Amount (PKR)</label>
                  <input type="number" placeholder="Amount to send" value={bonusAmount} onChange={e => setBonusAmount(e.target.value)} />
                </div>
                <button className="btn-premium py-3 w-full mt-4">Credit Balance</button>
              </form>
            </div>

            <div className="glass-card p-8 bg-accent/5 border-accent/20">
              <h3 className="font-bold mb-6 flex items-center gap-2"><i className="ri-flashlight-line text-accent"></i> Instant Plan Activation</h3>
              <form onSubmit={handleManualActivate} className="premium-form">
                <div className="form-group">
                  <label>User ID</label>
                  <input placeholder="Phone / Email" value={manualUserId} onChange={e => setManualUserId(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Select Portfolio</label>
                  <select value={manualPkgId} onChange={e => setManualPkgId(e.target.value)}>
                    <option value="">Select a plan</option>
                    {packages.map(p => <option key={p.id} value={p.id}>{p.name} (Rs {p.price})</option>)}
                  </select>
                </div>
                <button className="btn-premium py-3 w-full mt-4">Activate Instantly</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="glass-card p-6 h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {events.map((ev, i) => (
                <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 text-[10px]">
                  <div className="text-accent font-bold uppercase w-20">{ev.type}</div>
                  <div className="flex-1">
                    <span className="text-white">{ev.email || ev.userId || 'Anonymous'}</span>
                    <span className="text-text-dim mx-2">from</span>
                    <span className="font-mono text-text-secondary">{ev.ip || '0.0.0.0'}</span>
                    <div className="mt-1 text-text-muted italic">{new Date(ev.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

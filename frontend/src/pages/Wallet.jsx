import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useToast } from '../components/Toast'

export default function Wallet() {
  const toast = useToast()
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('de_user')
    return saved ? JSON.parse(saved) : null
  })
  const [txs, setTxs] = useState([])
  const [amount, setAmount] = useState('')
  const [payoutMethod, setPayoutMethod] = useState(user?.payoutMethod || 'JazzCash')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('de_token')
        if (!token) return
        api.setToken(token)
        const meRes = await api.me()
        if (meRes.user) setUser(meRes.user)
        const txRes = await api.getTransactions()
        if (txRes.transactions) setTxs(txRes.transactions)
      } catch (e) { console.error('Ledger sync failure', e) }
    }
    load()
  }, [])

  async function handleWithdraw(e) {
    e.preventDefault()
    if (!amount || Number(amount) < 30) { toast.show('Minimum withdrawal threshold: Rs 30', 'error'); return }
    setLoading(true)
    try {
      const r = await api.withdraw({ amount, method: payoutMethod, account: user?.payoutAccount || 'Not set' })
      if (r.error) { toast.show(r.error, 'error'); return }
      toast.show('Liquidation request initiated successfully.', 'success')
      setAmount('')
      const meRes = await api.me()
      if (meRes.user) {
        setUser(meRes.user)
        localStorage.setItem('de_user', JSON.stringify(meRes.user))
        window.dispatchEvent(new CustomEvent('userUpdate', { detail: meRes.user }))
      }
      const txRes = await api.getTransactions()
      if (txRes.transactions) setTxs(txRes.transactions)
    } catch (e) { toast.show('Signal failure', 'error') }
    finally { setLoading(false) }
  }

  return (
    <div className="animate-premium-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="section-title">Withdraw Funds</h1>
          <p className="text-text-secondary">Withdraw your accumulated profit to your account.</p>
        </div>
        <div className="glass-card py-3 px-8 flex items-center gap-4">
          <div className="text-xs text-text-dim uppercase font-bold">Available Balance</div>
          <div className="text-2xl font-bold text-white">Rs {user?.wallet?.toFixed(2) || '0.00'}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="ri-funds-box-line text-accent"></i> Withdrawal Form
            </h3>
            <form className="premium-form" onSubmit={handleWithdraw}>
              <div className="form-group">
                <label>Withdrawal Amount (Rs)</label>
                <input
                  type="number"
                  placeholder="Min: 30"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Payout Method</label>
                <select value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value)}>
                  <option value="JazzCash">JazzCash</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                </select>
              </div>
              <button className="btn-premium py-4" disabled={loading}>
                {loading ? 'Processing...' : 'Withdraw Now'}
              </button>
              <p className="text-[10px] text-text-dim text-center mt-4">
                * A 10% service fee is applied to all withdrawals.
              </p>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="ri-history-line text-accent"></i> Withdrawal History
          </h3>
          <div className="glass-card p-0 overflow-hidden">
            <div className="admin-table-container">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 uppercase text-[10px] font-bold text-text-muted tracking-widest">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {txs.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-text-dim">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-bold uppercase">{tx.type}</td>
                      <td className="p-4 text-white">Rs {tx.amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          tx.status === 'denied' ? 'bg-red-500/10 text-accent' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                          {tx.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {txs.length === 0 && (
                    <tr><td colSpan="4" className="p-8 text-center text-text-dim">No ledger entries detected.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

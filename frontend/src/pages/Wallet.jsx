import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom'
import api from '../services/api'
import { useToast } from '../components/Toast'

export default function Wallet() {
  const toast = useToast()
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('de_user')
    return saved ? JSON.parse(saved) : null
  })
  const [txs, setTxs] = useState([])
  const [amount, setAmount] = useState('')
  const [payoutMethod, setPayoutMethod] = useState(user?.payoutMethod || 'JazzCash')
  const [loading, setLoading] = useState(false)

  const [showLockModal, setShowLockModal] = useState(false)

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

    // Check if withdrawal info is complete
    if (!user?.payoutName || !user?.payoutMethod || !user?.payoutAccount) {
      toast.show('Please complete your withdrawal details in Profile first', 'error')
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
      return
    }

    if (!amount || Number(amount) < 30) { toast.show('Minimum withdrawal threshold: Rs 30', 'error'); return }
    setLoading(true)
    try {
      const r = await api.withdraw({ amount, method: payoutMethod, account: user?.payoutAccount || 'Not set' })
      if (r.error) {
        if (r.error === 'WITHDRAWAL_LOCKED') {
          setShowLockModal(true)
        } else {
          toast.show(r.error, 'error')
        }
        setLoading(false)
        return
      }
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
    } catch (e) {
      console.error('Withdrawal error:', e)
      toast.show('Signal failure', 'error')
    }
    finally { setLoading(false) }
  }

  return (
    <div className="animate-premium-in space-y-8 relative">
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
                * A 15% service fee is applied to all withdrawals.
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

      {showLockModal && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card max-w-md w-full p-6 relative border-accent/20 animate-scale-up shadow-2xl">
              <button
                onClick={() => setShowLockModal(false)}
                className="absolute top-4 right-4 text-text-dim hover:text-white transition-colors"
                type="button"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lock-2-line text-3xl text-accent"></i>
                </div>

                <h3 className="text-xl font-bold text-white">Unlock Withdrawal</h3>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-left space-y-4">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Invite minimum 3 friends and at least 1 of them must deposit to unlock withdrawal. This will double your commission.
                  </p>
                  <div className="h-px bg-white/10"></div>
                  <p className="text-sm text-text-secondary leading-relaxed font-urdu text-right" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    کم از کم 3 دوستوں کو مدعو کریں اور ان میں سے کم از کم 1 کو ڈپازٹ کرنا ضروری ہے تاکہ ودڈرال ان لاک ہو سکے۔ اس سے آپ کا کمیشن دوگنا ہو جائے گا۔
                  </p>
                </div>

                <button
                  onClick={() => { setShowLockModal(false); navigate('/referrals') }}
                  className="btn-premium w-full py-3 mt-4"
                >
                  Go to Referrals <i className="ri-arrow-right-line ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}

// Simple Portal component to render children into body
function Portal({ children }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? ReactDOM.createPortal(children, document.body) : null
}

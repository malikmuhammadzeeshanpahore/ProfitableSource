import React, { useState, useEffect } from 'react'
import api from '../services/api'
import copyToClipboard from '../utils/clipboard'
import { useToast } from '../components/Toast'

export default function Deposit() {
  const toast = useToast()
  const [amount, setAmount] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [file, setFile] = useState(null)
  const [sentWith, setSentWith] = useState('JazzCash') // New field: which app was used to send
  const [history, setHistory] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('de_token')
        if (token) {
          api.setToken(token)
          const h = await api.getDeposits()
          if (h.deposits) setHistory(h.deposits)
        }
      } catch (e) { console.error('Failed to load history', e) }
    }
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return // Prevent double submission
    if (!amount || Number(amount) < 200) { toast.show('Minimum injection Rs 200', 'error'); return }
    if (!transactionId) { toast.show('Transaction ID is required for verification.', 'error'); return }
    if (!file) { toast.show('Screenshot is required for verification.', 'error'); return }

    setSubmitting(true)
    try {
      const r = await api.createDeposit(amount, 'SadaPay', transactionId, file, sentWith)
      if (r.error) {
        toast.show(r.error, 'error')
        setSubmitting(false)
        return
      }
      toast.show('Capital injection initiated. Verification in progress...', 'success')
      setAmount('')
      setTransactionId('')
      setFile(null)
      const h = await api.getDeposits()
      if (h.deposits) setHistory(h.deposits)

      // Keep button locked for 3 seconds to prevent rapid resubmission
      setTimeout(() => {
        setSubmitting(false)
      }, 3000)
    } catch (e) {
      toast.show('Sync error: Could not submit deposit.', 'error')
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-premium-in max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
        <p className="text-text-secondary">Send funds to our SadaPay account to add balance to your wallet.</p>
      </div>

      {/* SadaPay Info Card */}
      <div className="glass-card p-8 animate-fade-in space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="ri-bank-card-line text-accent"></i> SadaPay Account Details
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 glass-card bg-accent/5">
              <div className="flex-1">
                <div className="text-[10px] text-accent font-black uppercase tracking-widest mb-1">Account Holder</div>
                <div className="text-xl font-bold tracking-tight">Profitable Source</div>
              </div>
              <div className="h-full w-px bg-white/10"></div>
              <div className="flex-1 text-right">
                <div className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">Method</div>
                <div className="text-xl font-bold tracking-tight text-white flex items-center justify-end gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                  SadaPay
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-accent/20 flex items-center justify-between group hover:border-accent transition-all duration-500">
              <div>
                <div className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">SadaPay Number</div>
                <div className="text-3xl font-black tracking-tighter text-white group-hover:text-accent transition-colors">03344379353</div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('03344379353')
                  toast.show('Number copied to clipboard', 'info')
                }}
                className="h-14 w-14 rounded-2xl bg-white/5 @include flex-center hover:bg-accent hover:text-white transition-all duration-300"
              >
                <i className="ri-file-copy-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="ri-upload-cloud-2-line text-accent"></i> Submit Payment Proof
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            Send money to the SadaPay number above, then enter the details below for verification.
          </p>
          <form className="premium-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (Rs)</label>
              <input type="number" placeholder="Enter amount sent" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Sent with (Payment App)</label>
              <select value={sentWith} onChange={e => setSentWith(e.target.value)} className="w-full">
                <option value="JazzCash">JazzCash</option>
                <option value="EasyPaisa">EasyPaisa</option>
                <option value="SadaPay">SadaPay</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Transaction ID (TID)</label>
              <input placeholder="Enter the 11-digit TID" value={transactionId} onChange={e => setTransactionId(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Screenshot (Required)</label>
              <input type="file" accept="image/*" className="cursor-pointer" onChange={e => setFile(e.target.files[0])} required />
            </div>
            <button className="btn-premium w-full mt-4 py-4">Verify Deposit</button>
          </form>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="ri-history-line text-accent"></i> Payment History
        </h3>
        <div className="glass-card p-0 overflow-hidden">
          <div className="admin-table-container">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-[10px] uppercase font-bold text-text-muted tracking-widest">
                <tr>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead >
              <tbody className="divide-y divide-white/5">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="p-4 text-white font-bold">Rs {h.amount}</td>
                    <td className="p-4 text-text-dim">{h.method}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${h.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                        h.status === 'denied' ? 'bg-red-500/10 text-accent' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {h.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr><td colSpan="3" className="p-12 text-center text-text-dim italic">No payments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  )
}

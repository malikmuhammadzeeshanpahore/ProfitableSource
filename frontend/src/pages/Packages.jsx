import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useToast } from '../components/Toast'

export default function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [purchasedPackages, setPurchasedPackages] = useState({}) // Track purchased packages with timestamps
  const toast = useToast()

  useEffect(() => {
    async function load() {
      try {
        const r = await api.getPackages()
        if (r.packages) {
          setPackages(r.packages.sort((a, b) => a.price - b.price))
        }
      } catch (e) {
        console.error('Failed to load plans', e)
      }
    }
    load()

    const onAuthError = () => {
      toast.show('Session expired. Please log in again.', 'error')
    }
    window.addEventListener('authError', onAuthError)
    return () => window.removeEventListener('authError', onAuthError)
  }, [])

  // Check cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const updated = { ...purchasedPackages }
      let hasChanges = false

      Object.keys(updated).forEach(pkgId => {
        if (now - updated[pkgId] > 180000) { // 3 minutes = 180000ms
          delete updated[pkgId]
          hasChanges = true
        }
      })

      if (hasChanges) {
        setPurchasedPackages(updated)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [purchasedPackages])

  async function buy(pkgId) {
    if (loading || purchasedPackages[pkgId]) return
    setLoading(true)
    try {
      const r = await api.buyPackage(pkgId)
      if (r.error) {
        if (r.error === 'insufficient_funds') {
          toast.show(`Insufficient balance. You need Rs ${r.required} more.`, 'error')
        } else {
          toast.show(r.error, 'error')
        }
        return
      }

      // Mark package as purchased with timestamp
      setPurchasedPackages(prev => ({ ...prev, [pkgId]: Date.now() }))
      toast.show('Investment successful! Your plan is now active.', 'success')

      const me = await api.me()
      if (me.user) {
        localStorage.setItem('de_user', JSON.stringify(me.user))
        window.dispatchEvent(new CustomEvent('userUpdate', { detail: me.user }))
      }
    } catch (e) {
      toast.show('Investment failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-premium-in space-y-16 py-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tight">
          Earnings <span className="text-accent">Portfolios</span>
        </h1>
        <p className="text-text-secondary text-lg font-medium opacity-80">
          Professional investment plans designed for consistent asset growth.
          Choose a tier and start earning daily profit instantly.
        </p>
      </div>

      <div className="packages-grid pb-12">
        {packages.map((pkg, idx) => {
          const isFamous = idx === 2 || idx === 5 // Highlight some plans
          // Assign icons based on index or name
          const icons = [
            'ri-copper-coin-line',
            'ri-money-dollar-circle-line',
            'ri-vip-diamond-line',
            'ri-briefcase-4-line',
            'ri-bank-card-2-line',
            'ri-trophy-line',
            'ri-building-2-line',
            'ri-global-line'
          ]
          const icon = icons[idx % icons.length]

          return (
            <div key={pkg.id} className={`elite-card ${pkg.locked ? 'locked' : ''} ${isFamous ? 'featured' : ''}`}>
              {isFamous && <div className="featured-badge">MOST POPULAR</div>}

              <div className="card-top">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="plan-name">{pkg.name}</h3>
                    <div className={`plan-icon ${isFamous ? 'glow' : ''}`}>
                      <i className={pkg.locked ? 'ri-lock-line' : icon}></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-middle">
                <div className="price-box">
                  <span className="currency">Rs</span>
                  <span className="amount">{pkg.price.toLocaleString()}</span>
                </div>
                <div className="daily-reward">
                  <span className="label">Daily Profit</span>
                  <span className="value">Rs {pkg.dailyClaim.toLocaleString()}</span>
                </div>
              </div>

              <div className="card-bottom">
                <div className="feature-list">
                  <div className="feature-item">
                    <i className="ri-time-line"></i>
                    <span>Duration: {pkg.duration} Days</span>
                  </div>
                  <div className="feature-item">
                    <i className="ri-shield-star-line"></i>
                    <span>Secure Infrastructure</span>
                  </div>
                  <div className="feature-item">
                    <i className="ri-customer-service-2-line"></i>
                    <span>24/7 Priority Support</span>
                  </div>
                </div>

                {pkg.locked ? (
                  <button className="btn-locked" disabled>
                    <i className="ri-lock-2-line"></i> Locked
                  </button>
                ) : purchasedPackages[pkg.id] ? (
                  <button className="btn-success" disabled>
                    <i className="ri-check-line"></i> Plan Purchased
                  </button>
                ) : (
                  <button
                    className="btn-invest"
                    onClick={() => buy(pkg.id)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Invest Now'}
                    <i className="ri-arrow-right-line"></i>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Trust Info */}
      <div className="max-w-5xl mx-auto">
        <div className="info-banner">
          <div className="flex items-center gap-6">
            <div className="icon-wrap">
              <i className="ri-safe-2-line"></i>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Guaranteed Payout Protocols</h4>
              <p className="text-sm text-text-secondary opacity-70">
                Your investments are secured by our Tier-1 automated infrastructure.
                Withdrawals are processed instantly once threshold is met.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

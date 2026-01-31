import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const u = localStorage.getItem('de_user')
    if (u) setUser(JSON.parse(u))

    const onUpdate = (e) => { if (e.detail) setUser(e.detail) }
    window.addEventListener('userUpdate', onUpdate)
    return () => window.removeEventListener('userUpdate', onUpdate)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  const tickerItems = [
    "User 42xx withdrew Rs 12,400 | User 88xx invested Rs 5,000",
    "BTC +2.4% | ETH -1.2% | TOTAL INVESTMENTS: Rs 4.2M",
    "User 19xx withdrew Rs 4,500 | User 33xx invested Rs 25,000",
    "ACTIVE USERS: 14,290 | Payout Status: NORMAL",
    "User 77xx withdrew Rs 1,200 | User 11xx invested Rs 15,000"
  ]

  return (
    <header className="header-premium">
      <div className="header-inner glass-bg">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="logo-box-premium">PS</div>
          <span className="logo-text-premium hidden md:block">Profitable Source</span>
        </Link>
        <div className="ticker-container hidden md:flex">
          <div className="ticker-track">
            {tickerItems.map((text, i) => (
              <span key={i} className="ticker-item font-mono">{text}</span>
            ))}
          </div>
        </div>

        <div className="header-actions">
          {user ? (
            <div className="user-control">
              <div className="balance-display glass-bg">
                <span className="label">Balance</span>
                <span className="value">Rs {user.wallet?.toFixed(2) || '0.00'}</span>
              </div>

              <div className="profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="avatar shadow-glow-red">{user.name ? user.name[0].toUpperCase() : 'U'}</div>
                <i className="ri-arrow-down-s-line"></i>

                {showDropdown && (
                  <div className="dropdown-panel glass-bg animate-premium-in">
                    <div className="panel-header">
                      <div className="name">{user.name}</div>
                      <div className="rank">{user.highestPlan || 'No Active Plan'}</div>
                    </div>
                    <Link to="/profile" className="panel-item" onClick={() => setShowDropdown(false)}>
                      <i className="ri-user-line"></i> Profile
                    </Link>
                    <hr className="border-white/5 my-2" />
                    <button className="panel-item text-accent w-full text-left" onClick={handleLogout}>
                      <i className="ri-logout-box-r-line"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/auth" className="btn-outline-premium py-2 px-6 text-sm">Portal Access</Link>
              <Link to="/auth" className="btn-premium py-2 px-6 text-sm">Initialize</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

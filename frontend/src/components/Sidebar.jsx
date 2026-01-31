import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const user = (() => {
    const saved = localStorage.getItem('de_user')
    return saved ? JSON.parse(saved) : null
  })()

  const navItems = [
    { path: '/dashboard', icon: 'ri-dashboard-fill', label: 'Dashboard' },
    { path: '/packages', icon: 'ri-briefcase-4-fill', label: 'Investment Plans' },
    { path: '/deposit', icon: 'ri-download-cloud-2-fill', label: 'Deposit' },
    { path: '/wallet', icon: 'ri-wallet-3-fill', label: 'Wallet' },
    { path: '/referrals', icon: 'ri-team-fill', label: 'Referrals' },
    { path: '/profile', icon: 'ri-user-settings-fill', label: 'Profile' }
  ]

  if (user && user.role === 'admin') {
    navItems.push({ path: '/admin', icon: 'ri-shield-user-fill', label: 'Admin Panel' })
  }

  return (
    <aside className={`sidebar-premium ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-inner glass-bg">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="logo-icon">PS</div>
            {!collapsed && <span className="logo-text">Profitable Source</span>}
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            <i className={collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'}></i>
          </button>
        </div>

        <nav className="sidebar-nav flex-1 px-4 space-y-2 py-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              {!collapsed && <span>{item.label}</span>}
              {location.pathname === item.path && <div className="active-indicator"></div>}
            </Link>
          ))}
        </nav>

        {!collapsed && (
          <div className="sidebar-footer">
            <div className="footer-status">
              <span className="pulse"></span> System Operational
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

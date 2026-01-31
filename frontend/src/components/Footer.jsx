import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Footer() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const auth = !!localStorage.getItem('de_user');
  const isLanding = location.pathname === '/';

  if (!auth || isLanding) return null;

  const navItems = [
    { path: '/dashboard', icon: 'ri-dashboard-fill', label: 'Dashboard' },
    { path: '/deposit', icon: 'ri-download-cloud-2-fill', label: 'Deposit' },
    { path: '/wallet', icon: 'ri-wallet-3-fill', label: 'Wallet' },
    { path: '/packages', icon: 'ri-briefcase-4-fill', label: 'Plans' },
    { path: '/profile', icon: 'ri-user-settings-fill', label: 'Profile' }
  ]

  return (
    <footer className="footer-mobile md:hidden">
      <div className="footer-inner glass-bg footer-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
            {isActive(item.path) && <div className="active-dot accent-glow"></div>}
          </Link>
        ))}
      </div>
    </footer>
  )
}

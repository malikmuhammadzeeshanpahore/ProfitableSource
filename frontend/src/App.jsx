import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Packages from './pages/Packages'
import Wallet from './pages/Wallet'
import Referrals from './pages/Referrals'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import SecretAdmin from './pages/SecretAdmin'
import Deposit from './pages/Deposit'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import LandingHeader from './components/LandingHeader'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import JoinChannelModal from './components/JoinChannelModal'
import ErrorBoundary from './components/ErrorBoundary'

import { ToastProvider } from './components/Toast'
import { startUserSync, stopUserSync } from './services/userSync'
import api from './services/api'

export default function App() {
  const location = useLocation()
  useEffect(() => { startUserSync(); return () => stopUserSync() }, [])

  useEffect(() => {
    try { api.postEvent({ type: 'pageview', meta: { path: window.location.pathname } }) } catch (e) { }
  }, [])

  const auth = !!localStorage.getItem('de_user')
  const isLanding = location.pathname === '/'
  const isAuthPage = location.pathname === '/auth'

  // Landing page gets its own full-width layout
  if (isLanding) {
    return (
      <ToastProvider>
        <ErrorBoundary>
          <Landing />
        </ErrorBoundary>
      </ToastProvider>
    )
  }

  // Auth page gets minimal layout
  if (isAuthPage) {
    return (
      <ToastProvider>
        <div className="app-layout no-sidebar">
          <div className="main-wrapper">
            <main className="content-area">
              <ErrorBoundary>
                <Auth />
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </ToastProvider>
    )
  }

  // Dashboard pages get full layout with sidebar
  const showSidebar = auth

  return (
    <ToastProvider>
      <div className={`app-layout ${showSidebar ? 'has-sidebar' : 'no-sidebar'}`}>
        <Header />
        <div className="main-wrapper">
          {showSidebar && <Sidebar />}
          <main className="content-area">
            <JoinChannelModal />
            <div className="content-section">
              <ErrorBoundary>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/deposit" element={<Deposit />} />
                  <Route path="/referrals" element={<Referrals />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/secret-admin/:code" element={<SecretAdmin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </ToastProvider>
  )
}

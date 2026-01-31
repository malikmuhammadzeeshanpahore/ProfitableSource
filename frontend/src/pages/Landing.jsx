import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Landing() {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const r = await api.getPackages()
        if (r.packages) setPackages(r.packages.sort((a, b) => a.price - b.price))
      } catch (e) { console.error(e) }
    }
    load()
  }, [])

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section id="home" className="py-32 md:py-40">
        <div className="premium-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-6 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-bold uppercase tracking-wider mb-8">
              Start Earning Today
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Your Path to <span className="text-gradient">Daily Profit</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of people earning consistent daily profit through our secure investment platform.
              Simple, transparent, and designed for your financial growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth" className="btn-premium py-5 px-12 text-lg">
                Start Earning Now
              </Link>
              <a href="#plans" className="btn-outline-premium py-5 px-12 text-lg">
                View Investment Plans
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-white mb-2">45k+</div>
                <div className="text-sm text-text-dim uppercase font-bold">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-white mb-2">Rs 12M+</div>
                <div className="text-sm text-text-dim uppercase font-bold">Total Payouts</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-white mb-2">99.9%</div>
                <div className="text-sm text-text-dim uppercase font-bold">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-white mb-2">24/7</div>
                <div className="text-sm text-text-dim uppercase font-bold">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white/5">
        <div className="premium-container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title mb-6">Why Choose Profitable Source?</h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                We provide a secure and transparent platform for individuals to grow their wealth through smart investment opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ri-shield-check-line text-accent text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">100% Secure</h3>
                <p className="text-text-secondary">
                  Your investments are protected with bank-grade security and encrypted transactions.
                </p>
              </div>

              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ri-money-dollar-circle-line text-accent text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Daily Earnings</h3>
                <p className="text-text-secondary">
                  Earn consistent daily profit from your investments. Claim your earnings anytime.
                </p>
              </div>

              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ri-customer-service-2-line text-accent text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Expert Support</h3>
                <p className="text-text-secondary">
                  Our dedicated team is available 24/7 to assist you with any questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="premium-container">
          <div className="text-center mb-16">
            <h2 className="section-title mb-6">How It Works</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Getting started is simple. Follow these three easy steps to begin earning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass-card p-10 relative">
              <div className="text-8xl font-black absolute -top-4 -right-4 opacity-5">01</div>
              <div className="relative">
                <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6">
                  <i className="ri-user-add-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4">Create Account</h3>
                <p className="text-text-secondary">
                  Sign up with your basic information and complete the simple verification process.
                </p>
              </div>
            </div>

            <div className="glass-card p-10 relative">
              <div className="text-8xl font-black absolute -top-4 -right-4 opacity-5">02</div>
              <div className="relative">
                <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6">
                  <i className="ri-wallet-3-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4">Choose Your Plan</h3>
                <p className="text-text-secondary">
                  Select an investment plan that matches your budget and financial goals.
                </p>
              </div>
            </div>

            <div className="glass-card p-10 relative">
              <div className="text-8xl font-black absolute -top-4 -right-4 opacity-5">03</div>
              <div className="relative">
                <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6">
                  <i className="ri-line-chart-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4">Start Earning</h3>
                <p className="text-text-secondary">
                  Watch your investment grow with daily profit that you can claim anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Investment Plans */}
      <section id="services" className="py-24 bg-white/5">
        <div className="premium-container">
          <div className="text-center mb-16">
            <h2 className="section-title mb-6">Investment Plans</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Choose from our range of investment plans designed to fit every budget and goal.
            </p>
          </div>

          <div id="plans" className="packages-grid max-w-6xl mx-auto">
            {packages.map((pkg, idx) => {
              const isFeatured = idx === 2 || idx === 5;
              return (
                <div key={pkg.id} className={`elite-card ${pkg.locked ? 'locked' : ''} ${isFeatured ? 'featured' : ''}`}>
                  {isFeatured && <div className="featured-badge">MOST POPULAR</div>}

                  <div className="card-top">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="plan-name">{pkg.name}</h3>
                        <div className="tier-tag">TIER {idx + 1}</div>
                      </div>
                      <div className={`plan-icon ${isFeatured ? 'glow' : ''}`}>
                        <i className={pkg.locked ? 'ri-lock-line' : 'ri-verified-badge-line'}></i>
                      </div>
                    </div>
                  </div>

                  <div className="card-middle">
                    <div className="price-box">
                      <span className="currency">Rs</span>
                      <span className="amount">{pkg.price.toLocaleString()}</span>
                    </div>
                    <div className="daily-reward">
                      <span className="label">Daily Profit:</span>
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
                        <span>Secure Investment</span>
                      </div>
                    </div>

                    {pkg.locked ? (
                      <button className="btn-locked" disabled>
                        <i className="ri-lock-2-line"></i> Locked
                      </button>
                    ) : (
                      <Link to="/auth" className="btn-invest no-underline">
                        Get Started <i className="ri-arrow-right-line"></i>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="premium-container">
          <div className="text-center mb-16">
            <h2 className="section-title mb-6">What Our Members Say</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Join thousands of satisfied members who are earning daily profit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Ahmed K.', quote: 'Best investment platform I\'ve used. Daily profits are consistent and withdrawals are fast!' },
              { name: 'Fatima S.', quote: 'Started with a small investment and now earning daily. The support team is very helpful.' },
              { name: 'Hassan M.', quote: 'Transparent and reliable. I\'ve been earning for 6 months now without any issues.' }
            ].map(t => (
              <div key={t.name} className="glass-card p-8 bg-white/5">
                <i className="ri-double-quotes-l text-4xl text-accent opacity-20 block mb-4"></i>
                <p className="text-text-secondary leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="text-sm font-bold text-white">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-32 bg-accent/5">
        <div className="premium-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
              Join Profitable Source today and start your journey to financial freedom.
              Our team is here to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link to="/auth" className="btn-premium py-6 px-16 text-xl">
                Create Free Account
              </Link>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="glass-card p-6 flex items-center gap-4">
                <i className="ri-telegram-fill text-accent text-3xl"></i>
                <div className="text-left">
                  <div className="text-sm text-text-dim uppercase font-bold mb-1">Telegram</div>
                  <div className="text-white font-bold">Official Channel</div>
                </div>
              </div>
              <div className="glass-card p-6 flex items-center gap-4">
                <i className="ri-customer-service-fill text-accent text-3xl"></i>
                <div className="text-left">
                  <div className="text-sm text-text-dim uppercase font-bold mb-1">Support</div>
                  <div className="text-white font-bold">24/7 Live Chat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="premium-container">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-2xl font-black text-white mb-4">Profitable Source</div>
              <p className="text-sm text-text-dim leading-relaxed">
                Your trusted platform for secure online investment and daily earning opportunities.
              </p>
            </div>
            <div>
              <h6 className="font-bold text-white uppercase text-xs tracking-widest mb-4">Quick Links</h6>
              <ul className="space-y-3 text-sm text-text-dim">
                <li><button onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })} className="hover:text-accent transition-colors">Home</button></li>
                <li><button onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} className="hover:text-accent transition-colors">About</button></li>
                <li><button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} className="hover:text-accent transition-colors">Services</button></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-white uppercase text-xs tracking-widest mb-4">Account</h6>
              <ul className="space-y-3 text-sm text-text-dim">
                <li><Link to="/auth" className="hover:text-accent transition-colors">Login</Link></li>
                <li><Link to="/auth" className="hover:text-accent transition-colors">Register</Link></li>
                <li><Link to="/packages" className="hover:text-accent transition-colors">Investment Plans</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-white uppercase text-xs tracking-widest mb-4">Connect</h6>
              <ul className="space-y-3 text-sm text-text-dim">
                <li className="flex items-center gap-2"><i className="ri-telegram-fill text-accent"></i> Telegram</li>
                <li className="flex items-center gap-2"><i className="ri-customer-service-fill text-accent"></i> Support</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center">
            <div className="text-xs uppercase font-bold text-text-dim">
              © 2026 Profitable Source. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

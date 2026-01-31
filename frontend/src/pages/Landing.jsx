import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import LandHeader from '../components/LandingHeader'

// Note: We use the structure from the original index.html to preserve the design user liked.
// The CSS is now imported in main.jsx (landing.css).

export default function Landing() {
  const [packages, setPackages] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const r = await api.getPackages()
        if (r.packages) setPackages(r.packages.sort((a, b) => a.price - b.price))
      } catch (e) { console.error(e) }
    }
    load()
  }, [])

  // Smooth scroll handler
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <div className="landing-page-wrapper">
      {/* Header - Recreating the landing-header from static HTML */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="logo">
              <div className="logo-icon">PS</div>
              <span className="logo-text">Profitable Source</span>
            </a>

            <nav className="nav-desktop">
              <button onClick={() => scrollTo('home')} className="nav-link bg-transparent border-0 cursor-pointer">Home</button>
              <button onClick={() => scrollTo('about')} className="nav-link bg-transparent border-0 cursor-pointer">About</button>
              <button onClick={() => scrollTo('services')} className="nav-link bg-transparent border-0 cursor-pointer">Services</button>
              <button onClick={() => scrollTo('contact')} className="nav-link bg-transparent border-0 cursor-pointer">Contact</button>
              <Link to="/auth" className="btn-earn">Earn Now</Link>
            </nav>

            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <i className={mobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
            </button>
          </div>

          <nav className={`nav-mobile ${mobileMenuOpen ? 'active' : ''}`} id="mobileMenu">
            <button onClick={() => scrollTo('home')} className="nav-link-mobile bg-transparent border-0 text-left cursor-pointer">Home</button>
            <button onClick={() => scrollTo('about')} className="nav-link-mobile bg-transparent border-0 text-left cursor-pointer">About</button>
            <button onClick={() => scrollTo('services')} className="nav-link-mobile bg-transparent border-0 text-left cursor-pointer">Services</button>
            <button onClick={() => scrollTo('contact')} className="nav-link-mobile bg-transparent border-0 text-left cursor-pointer">Contact</button>
            <a href="/downloads/profitable_source.apk" download className="btn-download-mobile">
              <i className="ri-download-cloud-fill"></i> Download App
            </a>
            <Link to="/auth" className="btn-earn-mobile">Earn Now</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="badge">Start Earning Today</div>
            <h1 className="hero-title">
              Your Path to <span className="gradient-text">Daily Profit</span>
            </h1>
            <p className="hero-description">
              Join thousands of people earning consistent daily profit through our secure investment platform.
              Simple, transparent, and designed for your financial growth.
            </p>
            <div className="hero-buttons">
              <Link to="/auth" className="btn-primary">Start Earning Now</Link>
              <button onClick={() => scrollTo('services')} className="btn-secondary bg-transparent cursor-pointer">View Investment Plans</button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">45k+</div>
                <div className="stat-label">Active Members</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">Rs 12M+</div>
                <div className="stat-label">Total Payouts</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">99.9%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Profitable Source?</h2>
            <p className="section-subtitle">
              We provide a secure and transparent platform for individuals to grow their wealth through smart
              investment opportunities.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="ri-shield-check-line"></i>
              </div>
              <h3 className="feature-title">100% Secure</h3>
              <p className="feature-text">
                Your investments are protected with bank-grade security and encrypted transactions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="ri-money-dollar-circle-line"></i>
              </div>
              <h3 className="feature-title">Daily Earnings</h3>
              <p className="feature-text">
                Earn consistent daily profit from your investments. Claim your earnings anytime.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="ri-customer-service-2-line"></i>
              </div>
              <h3 className="feature-title">Expert Support</h3>
              <p className="feature-text">
                Our dedicated team is available 24/7 to assist you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Getting started is simple. Follow these three easy steps to begin earning.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <i className="ri-user-add-line"></i>
              </div>
              <h3 className="step-title">Create Account</h3>
              <p className="step-text">
                Sign up with your basic information and complete the simple verification process.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <i className="ri-wallet-3-line"></i>
              </div>
              <h3 className="step-title">Choose Your Plan</h3>
              <p className="step-text">
                Select an investment plan that matches your budget and financial goals.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <i className="ri-line-chart-line"></i>
              </div>
              <h3 className="step-title">Start Earning</h3>
              <p className="step-text">
                Watch your investment grow with daily profit that you can claim anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="download-app-section">
        <div className="container">
          <div className="download-app-content">
            <div className="download-app-text">
              <h2 className="download-app-title">Get the Mobile App</h2>
              <p className="download-app-description">
                Experience seamless investment management on the go. Download our mobile app for instant access
                to your portfolio, real-time updates, and quick profit claims.
              </p>
            </div>
            <a href="/downloads/profitable_source.apk" download className="btn-download-large">
              <i className="ri-download-cloud-fill"></i>
              Download App
            </a>
          </div>
        </div>
      </section>

      {/* Services / Plans */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Investment Plans</h2>
            <p className="section-subtitle">
              Choose from our range of investment plans designed to fit every budget and goal.
            </p>
          </div>

          <div id="plansContainer" className="plans-grid">
            {packages.length === 0 ? (
              <div className="col-span-full text-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading plans...</p>
              </div>
            ) : (
              packages.map((plan, index) => (
                <div key={plan.id} className="plan-card">
                  <div className="plan-header">
                    <div>
                      <div className="plan-name">{plan.name}</div>
                      <div className="plan-tier">TIER {index + 1}</div>
                    </div>
                    <div className="plan-icon">
                      <i className={plan.locked ? 'ri-lock-line' : 'ri-verified-badge-line'}></i>
                    </div>
                  </div>

                  <div className="plan-price">Rs {plan.price.toLocaleString()}</div>
                  <div className="plan-daily">Daily Profit: Rs {plan.dailyClaim.toLocaleString()}</div>

                  <div className="plan-features">
                    <div className="plan-feature">
                      <i className="ri-time-line"></i>
                      <span>Duration: {plan.duration} Days</span>
                    </div>
                    <div className="plan-feature">
                      <i className="ri-shield-star-line"></i>
                      <span>Secure Investment</span>
                    </div>
                  </div>

                  {plan.locked
                    ? <button className="plan-button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}><i className="ri-lock-2-line"></i> Locked</button>
                    : <Link to="/auth" className="plan-button">Get Started <i className="ri-arrow-right-line"></i></Link>
                  }
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Members Say</h2>
            <p className="section-subtitle">
              Join thousands of satisfied members who are earning daily profit.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <i className="ri-double-quotes-l quote-icon"></i>
              <p className="testimonial-text">
                "Best investment platform I've used. Daily profits are consistent and withdrawals are fast!"
              </p>
              <div className="testimonial-author">— Ahmed K.</div>
            </div>

            <div className="testimonial-card">
              <i className="ri-double-quotes-l quote-icon"></i>
              <p className="testimonial-text">
                "Started with a small investment and now earning daily. The support team is very helpful."
              </p>
              <div className="testimonial-author">— Fatima S.</div>
            </div>

            <div className="testimonial-card">
              <i className="ri-double-quotes-l quote-icon"></i>
              <p className="testimonial-text">
                "Transparent and reliable. I've been earning for 6 months now without any issues."
              </p>
              <div className="testimonial-author">— Hassan M.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Earning?</h2>
            <p className="cta-text">
              Join Profitable Source today and start your journey to financial freedom.
              Our team is here to support you every step of the way.
            </p>
            <Link to="/auth" className="btn-primary-large">Create Free Account</Link>

            <div className="contact-grid">
              <a href="https://t.me/profitablesource_offical_service" target="_blank" className="contact-card">
                <i className="ri-telegram-fill"></i>
                <div className="contact-info">
                  <div className="contact-label">Telegram</div>
                  <div className="contact-value">Official Service</div>
                </div>
              </a>
              <a href="https://whatsapp.com/channel/0029VbBiOW9Dp2QC0PlpvB3V" target="_blank"
                className="contact-card">
                <i className="ri-whatsapp-fill"></i>
                <div className="contact-info">
                  <div className="contact-label">WhatsApp</div>
                  <div className="contact-value">Official Channel</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand">Profitable Source</div>
              <p className="footer-desc">
                Your trusted platform for secure online investment and daily earning opportunities.
              </p>
            </div>

            <div className="footer-col">
              <h6 className="footer-heading">Quick Links</h6>
              <ul className="footer-links">
                <li><button onClick={() => scrollTo('home')} className="bg-transparent border-0 cursor-pointer text-inherit">Home</button></li>
                <li><button onClick={() => scrollTo('about')} className="bg-transparent border-0 cursor-pointer text-inherit">About</button></li>
                <li><button onClick={() => scrollTo('services')} className="bg-transparent border-0 cursor-pointer text-inherit">Services</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h6 className="footer-heading">Account</h6>
              <ul className="footer-links">
                <li><Link to="/auth">Login</Link></li>
                <li><Link to="/auth">Register</Link></li>
                <li><Link to="/packages">Investment Plans</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h6 className="footer-heading">Connect</h6>
              <ul className="footer-links">
                <li><a href="https://t.me/profitablesource_offical_service" target="_blank"><i
                  className="ri-telegram-fill"></i> Telegram Support</a></li>
                <li><a href="https://whatsapp.com/channel/0029VbBiOW9Dp2QC0PlpvB3V" target="_blank"><i
                  className="ri-whatsapp-fill"></i> WhatsApp Channel</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Profitable Source. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

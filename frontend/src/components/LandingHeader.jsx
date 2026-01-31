import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LandingHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setMobileMenuOpen(false)
        }
    }

    const navItems = [
        { label: 'Home', id: 'home' },
        { label: 'About', id: 'about' },
        { label: 'Services', id: 'services' },
        { label: 'Contact', id: 'contact' }
    ]

    return (
        <header className="landing-header">
            <div className="landing-header-inner">
                <Link to="/" className="landing-logo">
                    <div className="logo-box-premium">PS</div>
                    <span className="logo-text-premium">Profitable Source</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="landing-nav hidden md:flex">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="landing-nav-link"
                        >
                            {item.label}
                        </button>
                    ))}
                    <Link to="/auth" className="btn-premium py-3 px-8">
                        Earn Now
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <i className={mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}></i>
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="landing-mobile-menu">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="landing-mobile-link"
                        >
                            {item.label}
                        </button>
                    ))}
                    <Link to="/auth" className="btn-premium py-4 w-full mt-4">
                        Earn Now
                    </Link>
                </div>
            )}
        </header>
    )
}

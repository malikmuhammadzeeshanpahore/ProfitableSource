import React, { useState, useEffect } from 'react'

export default function JoinChannelModal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('whatsapp_modal_seen')
    const isLoggedIn = localStorage.getItem('de_token')

    // Show modal only if user is logged in and hasn't seen it before
    if (isLoggedIn && !hasSeenModal) {
      // Show after 2 seconds delay
      const timer = setTimeout(() => {
        setShow(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    localStorage.setItem('whatsapp_modal_seen', 'true')
  }

  const handleJoin = () => {
    window.open('https://whatsapp.com/channel/0029VbBiOW9Dp2QC0PlpvB3V', '_blank')
    handleClose()
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative glass-card p-8 max-w-md w-full animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
        >
          <i className="ri-close-line text-white"></i>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* WhatsApp Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366]/20 flex items-center justify-center">
            <i className="ri-whatsapp-fill text-5xl text-[#25D366]"></i>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-black mb-3 text-white">Join Our WhatsApp Channel</h3>

          {/* Description */}
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            Stay updated with the latest news, announcements, and exclusive offers. Join our official WhatsApp channel now!
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleJoin}
              className="btn-premium w-full py-4 flex items-center justify-center gap-2"
            >
              <i className="ri-whatsapp-fill text-xl"></i>
              <span>Join Channel</span>
            </button>
            <button
              onClick={handleClose}
              className="btn-outline-premium w-full py-3 text-xs"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

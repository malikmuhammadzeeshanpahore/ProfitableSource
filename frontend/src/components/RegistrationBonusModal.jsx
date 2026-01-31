import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useToast } from './Toast'

export default function RegistrationBonusModal() {
    const [show, setShow] = useState(false)
    const [claiming, setClaiming] = useState(false)
    const [claimed, setClaimed] = useState(false)
    const toast = useToast()

    useEffect(() => {
        // Check if user has pending registration bonus
        const checkBonus = () => {
            const userStr = localStorage.getItem('de_user')
            if (!userStr) return

            const user = JSON.parse(userStr)
            if (user.registrationBonusPending === true) {
                // Show modal after 1 second delay
                setTimeout(() => {
                    setShow(true)
                }, 1000)
            }
        }

        checkBonus()

        // Listen for user updates
        const handleUserUpdate = (e) => {
            const user = e.detail
            if (user.registrationBonusPending === true && !show) {
                setTimeout(() => {
                    setShow(true)
                }, 1000)
            }
        }

        window.addEventListener('userUpdate', handleUserUpdate)
        return () => window.removeEventListener('userUpdate', handleUserUpdate)
    }, [])

    const handleClaim = async () => {
        setClaiming(true)
        try {
            const r = await api.claimRegistration()
            if (r.error) {
                toast.show(r.error, 'error')
                setClaiming(false)
                return
            }

            // Success!
            setClaimed(true)
            toast.show('🎉 Rs 20 Registration Bonus Claimed!', 'success')

            // Update user state
            const meRes = await api.me()
            if (meRes.user) {
                localStorage.setItem('de_user', JSON.stringify(meRes.user))
                window.dispatchEvent(new CustomEvent('userUpdate', { detail: meRes.user }))
            }

            // Close modal after 2 seconds
            setTimeout(() => {
                setShow(false)
            }, 2000)
        } catch (e) {
            toast.show('Failed to claim bonus', 'error')
            setClaiming(false)
        }
    }

    if (!show) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            {/* Modal */}
            <div className="relative glass-card p-8 max-w-md w-full animate-scale-in">
                {claimed ? (
                    // Success State
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center animate-bounce">
                            <i className="ri-gift-fill text-5xl text-accent"></i>
                        </div>
                        <h3 className="text-2xl font-black mb-3 text-white">Bonus Claimed!</h3>
                        <p className="text-sm text-text-secondary">Rs 20 has been added to your wallet</p>
                    </div>
                ) : (
                    // Claim State
                    <div className="text-center">
                        {/* Gift Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                            <i className="ri-gift-fill text-5xl text-accent"></i>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-black mb-3 text-white">Welcome Bonus!</h3>

                        {/* Amount */}
                        <div className="mb-4">
                            <div className="text-5xl font-black text-accent mb-2">Rs 20</div>
                            <p className="text-sm text-text-secondary">Registration Bonus</p>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                            Claim your welcome bonus now and start your earning journey!
                        </p>

                        {/* Claim Button */}
                        <button
                            onClick={handleClaim}
                            disabled={claiming}
                            className="btn-premium w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {claiming ? (
                                <>
                                    <i className="ri-loader-4-line animate-spin"></i>
                                    <span>Claiming...</span>
                                </>
                            ) : (
                                <>
                                    <i className="ri-hand-coin-line text-xl"></i>
                                    <span>Claim Rs 20 Now</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
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

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    )
}

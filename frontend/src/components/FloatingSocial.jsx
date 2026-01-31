import React from 'react'

export default function FloatingSocial() {
    return (
        <div className="fixed right-6 bottom-24 z-50 flex flex-col gap-4">
            {/* Telegram Icon */}
            <button
                onClick={() => {
                    // Link removed temporarily per user request
                    // Will add: window.open('https://t.me/profitablesource_offical_service', '_blank')
                }}
                className="floating-social-btn telegram"
                title="Telegram"
            >
                <i className="ri-telegram-fill text-2xl"></i>
            </button>

            {/* WhatsApp Icon */}
            <button
                onClick={() => {
                    // Link removed temporarily per user request
                    // Will add: window.open('https://whatsapp.com/channel/...', '_blank')
                }}
                className="floating-social-btn whatsapp"
                title="WhatsApp"
            >
                <i className="ri-whatsapp-fill text-2xl"></i>
            </button>

            <style jsx>{`
        .floating-social-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .floating-social-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .floating-social-btn.telegram:hover {
          background: #0088cc;
          border-color: #0088cc;
        }

        .floating-social-btn.whatsapp:hover {
          background: #25D366;
          border-color: #25D366;
        }

        @media (max-width: 768px) {
          .floating-social-btn {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
        </div>
    )
}

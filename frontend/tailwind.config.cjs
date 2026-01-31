module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B1120',
        secondary: '#111827',
        accent: '#EF4444',
        'accent-glow': 'rgba(239, 68, 68, 0.2)',
        'text-main': '#FFFFFF',
        'text-muted': '#9CA3AF',
      },
      boxShadow: {
        'glow-red': '0 0 15px 2px rgba(239, 68, 68, 0.3)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      }
    }
  },
  plugins: [],
}

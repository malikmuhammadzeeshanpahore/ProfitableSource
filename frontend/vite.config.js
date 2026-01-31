import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        auth: 'auth.html',
        dashboard: 'dashboard.html',
        packages: 'packages.html',
        wallet: 'wallet.html',
        deposit: 'deposit.html',
        referrals: 'referrals.html',
        profile: 'profile.html',
        admin: 'admin.html',
        secretAdmin: 'secret-admin.html',
      }
    }
  },
  server: {
    // enable network access and use a non-privileged port for local dev
    host: true,
    port: 5173,
    allowedHosts: true, // Allow all hosts
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/binance': {
        target: 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/binance/, '')
      }
    }
  }
})

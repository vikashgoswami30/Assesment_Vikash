import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/auth': 'https://assesment-vikash-1.onrender.com/5000',
    },
  },
  plugins: [react()],
})

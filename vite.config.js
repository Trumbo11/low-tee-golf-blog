import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls to local CMS during development
      '/api': {
        target: process.env.VITE_CMS_PROXY || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})

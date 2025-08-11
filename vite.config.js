import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_CMS_PROXY || 'http://localhost:4000'
  const devToken = env.CMS_DEV_TOKEN || env.SERVICE_TOKEN

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Forward API calls to local CMS during development
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          // Dev-only: align single-post route with CMS (`/api/post/:slug` -> `/api/posts/:slug`)
          rewrite: (path) => path.replace(/^\/api\/post\//, '/api/posts/'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (devToken) {
                proxyReq.setHeader('Authorization', `Bearer ${devToken}`)
              }
            })
          },
        },
      },
    },
  }
})

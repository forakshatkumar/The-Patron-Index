import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.PATRON_API_PROXY_TARGET || 'http://127.0.0.1:5000'
  return { plugins: [react(), tailwindcss()], server: { port: 5173, strictPort: true, proxy: {
    '/api': { target, changeOrigin: true, configure(proxy) {
      proxy.on('error', (_error, _req, res) => {
        if (!res.headersSent && typeof res.writeHead === 'function') {
          res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
          res.end(JSON.stringify({ message: 'Backend unavailable. Start the API server and check its database connection.' }))
        }
      })
    } }
  } } }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Every page of the static CampusLink site. Each one is built into dist/.
// Plain scripts (nav.js, data.js), the shared stylesheet (campuslink.css) and photos
// live in public/ and are copied as-is, so the stylesheet keeps its place before each
// page's own <style> block and page-specific rules still override it.
const pages = [
  'index', 'home', 'services', 'shop', 'gigs', 'career',
  'wallet', 'dashboard', 'login', 'register', 'admin', 'seller',
]
const rootDir = dirname(fileURLToPath(import.meta.url))

// Accounts, uploads, seller products and posted gigs come from the CampusLink server
// (`npm run server`, port 3001). In development Vite forwards those requests to it.
const API = `http://localhost:${process.env.API_PORT || 3001}`

export default defineConfig({
  plugins: [react()],
  server: {
    open: '/home.html',
    proxy: {
      '/api': API,
      '/uploads': API,
    },
  },
  preview: {
    proxy: {
      '/api': API,
      '/uploads': API,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(rootDir, `${p}.html`)])),
    },
  },
})

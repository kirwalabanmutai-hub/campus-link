import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Every page of the static CampusLink site. Each one is built into dist/.
// Plain scripts (nav.js, data.js) and photos live in public/ and are copied as-is.
const pages = [
  'index', 'home', 'services', 'shop', 'gigs', 'career',
  'wallet', 'dashboard', 'login', 'register', 'admin',
]
const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: {
    open: '/home.html',
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

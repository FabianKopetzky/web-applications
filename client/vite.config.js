import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    watch: {
      usePolling: true, // Ensures file change detection inside Docker
    },
    host: '0.0.0.0', // Allows external access
    strictPort: true,
  }
})

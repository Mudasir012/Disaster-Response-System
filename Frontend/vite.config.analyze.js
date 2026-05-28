import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: true, gzipSize: true })],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three'
          if (id.includes('node_modules/maplibre-gl/')) return 'maplibre'
          if (id.includes('node_modules/recharts/')) return 'recharts'
          if (id.includes('node_modules/socket.io-client/')) return 'socketio'
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router/')) return 'vendor'
        },
      },
    },
  },
})

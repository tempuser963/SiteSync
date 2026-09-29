import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],

  preview: {
    allowedHosts: ['karyasetu-ai-o5yd.onrender.com'],
  },
})

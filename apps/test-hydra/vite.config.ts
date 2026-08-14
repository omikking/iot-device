import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Hydra Local',
        short_name: 'HL',
        description: '',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'favicon.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'favicon.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
    }),
  ],

  preview: {
   allowedHosts: [
      "staging-hydralocal.groundsupport.mining.sandvik",
      "hydralocal.groundsupport.mining.sandvik"
   ],
  },

})

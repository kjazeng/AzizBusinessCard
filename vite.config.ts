import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'CardToBee',
        short_name: 'CardToBee',
        description: 'Create and share business cards quickly with CardToBee.',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/assets/cardtobee-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/cardtobee-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/assets/cardtobee-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});

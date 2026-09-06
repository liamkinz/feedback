import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        suppressWarnings: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,pdf}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            // cache Google Fonts if you use them
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: 'CSMR App',
        short_name: 'Feedback',
        description: 'A CSMR app built with Vue 3 and Vite',
        theme_color: '#4A90E2',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            // The 192/512px icon files this used to point at were never
            // actually added to the repo, so the manifest failed to load
            // them. CSMRLogo.png is already 1024x1024 — browsers scale a
            // single large icon down fine for both the regular and
            // maskable slots. Swap in real 192x192/512x512 exports later
            // if you want crisper small sizes.
            src: '/src/assets/CSMRLogo.png',
            sizes: '1024x1024',
            type: 'image/png',
          },
          {
            src: '/src/assets/CSMRLogo.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'maskable', // for Android adaptive icons
          },
        ],
      },
    }),
    ViteFonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

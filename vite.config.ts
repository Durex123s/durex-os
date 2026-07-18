import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  // GITHUB_SHA est fourni automatiquement par GitHub Actions à chaque run ;
  // sert à détecter côté app si une nouvelle version existe sur main.
  define: {
    __BUILD_COMMIT__: JSON.stringify(process.env.GITHUB_SHA ?? 'dev'),
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  plugins: [
    react(),

    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      open: false,
    }),

    VitePWA({
      injectRegister: false,
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],

      manifest: {
        name: 'Veyrion',
        short_name: 'Veyrion',
        description:
          'Assistant de vie personnel — planning, études, finances, discipline.',
        theme_color: '#0A0A0F',
        background_color: '#0A0A0F',
        display: 'standalone',

        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        mode: 'production',
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,

        globPatterns: [
          '**/*.{js,css,html,svg,png,ico}',
        ],

        navigateFallback: '/index.html',

        runtimeCaching: [
          {
            urlPattern:
              /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,

            handler: 'CacheFirst',

            options: {
              cacheName: 'google-fonts',

              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],

  build: {
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: true,
    },

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          const match = id.match(
            /node_modules\/(?:\.pnpm\/)?(@[^/]+\/[^/]+|[^/]+)/
          );

          const pkg = match ? match[1] : null;


          // React
          if (
            pkg === 'react' ||
            pkg === 'react-dom' ||
            pkg === 'scheduler'
          ) {
            return 'vendor-react';
          }


          // Navigation
          if (pkg === 'react-router-dom') {
            return 'vendor-router';
          }


          // Animations
          if (pkg === 'framer-motion') {
            return 'vendor-motion';
          }


          // Graphiques
          if (pkg === 'recharts') {
            return 'vendor-charts';
          }


          // Backend
          if (pkg === '@supabase/supabase-js') {
            return 'vendor-supabase';
          }


          // Data fetching
          if (pkg && pkg.startsWith('@tanstack')) {
            return 'vendor-query';
          }


          // Database locale
          if (
            pkg === 'dexie' ||
            pkg === 'dexie-react-hooks'
          ) {
            return 'vendor-db';
          }


          // Export PDF
          if (
            pkg === 'jspdf' ||
            pkg === 'jspdf-autotable'
          ) {
            return 'vendor-pdf';
          }


          // Excel
          if (pkg === 'xlsx') {
            return 'vendor-excel';
          }


          // Lecture PDF
          if (pkg === 'pdfjs-dist') {
            return 'vendor-pdf-reader';
          }


          // Icônes (utilisées partout, sinon éclatées dans le chunk fourre-tout)
          if (pkg === 'lucide-react') {
            return 'vendor-icons';
          }

          // Dates
          if (pkg === 'date-fns') {
            return 'vendor-date';
          }

          // Word (import .docx, déjà chargé à la demande via import() dynamique)
          if (pkg === 'mammoth') {
            return 'vendor-docx';
          }

          // Rendu HTML->canvas (utilisé par l'export PDF)
          if (pkg === 'html2canvas') {
            return 'vendor-html2canvas';
          }

          // Utilitaires légers regroupés ensemble plutôt que dispersés
          if (pkg === 'clsx' || pkg === 'zustand') {
            return 'vendor-utils';
          }

          return undefined;
        },
      },
    },

    // pdf-reader / excel / pdf-writer ne sont chargés qu'à l'usage (import()
    // dynamique dans fileImport.ts et backup.ts) — leur poids n'affecte pas
    // le chargement initial de l'app, donc on relève le seuil d'alerte pour
    // ne plus signaler ces chunks comme un problème.
    chunkSizeWarningLimit: 600,
  },


  server: {
    port: 5173,
  },
});

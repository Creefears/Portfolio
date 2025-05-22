import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@emotion/babel-plugin', { sourceMap: false }],
        ],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vj-logo.svg'],
      manifest: {
        name: 'Victor Jacob - Portfolio',
        short_name: 'VJ Portfolio',
        description: 'Portfolio de Victor Jacob - Lead Artist 3D & Spécialiste en Animation',
        theme_color: '#4F46E5',
        icons: [
          {
            src: 'vj-logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'vj-logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'vj-logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/i\.imgur\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'imgur-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/(www\.)?youtube\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'youtube-videos',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          },
          {
            urlPattern: /^https:\/\/drive\.google\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-drive-content',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              },
              networkTimeoutSeconds: 10
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ],
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'lucide': ['lucide-react'],
          'ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip'
          ],
          'components': [
            './src/components/AnimatedHeader.tsx',
            './src/components/CGIHeader.tsx',
            './src/components/RealFootageHeader.tsx',
            './src/components/ProjectCard/index.tsx'
          ]
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
        ecma: 2020,
        unsafe_arrows: true,
        unsafe_methods: true
      },
      mangle: {
        safari10: true,
        toplevel: true
      },
      format: {
        comments: false,
        ecma: 2020
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false
  },
  server: {
    open: true,
    hmr: {
      overlay: false
    },
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
});
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),
    adonisjs({ entrypoints: ['inertia/app.tsx', 'inertia/ssr.tsx'], reload: ['resources/views/**/*.edge'] }),
    tailwindcss(),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${import.meta.dirname}/inertia/`,
      '@generated': `${import.meta.dirname}/.adonisjs/client/`,
    },
    dedupe: ['@dr.pogodin/react-helmet', 'react', 'react-dom'],
  },

  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
  build: {
    modulePreload: {
      polyfill: false,
      resolveDependencies: () => []
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('lucide-react/dynamic')) {
            return 'lucide-dynamic'
          }
        }
      }
    }
  }
})

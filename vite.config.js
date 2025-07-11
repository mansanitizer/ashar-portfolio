import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Multi-page app configuration
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'game.html')
      }
    },
    // Copy static assets to dist
    assetsDir: 'assets',
    // Generate clean filenames for production
    cssCodeSplit: false
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    // Proxy configuration for future API calls
    proxy: {
      '/api': {
        target: 'https://your-backend.run.app',
        changeOrigin: true,
        secure: true,
        configure: (proxy, options) => {
          // Add custom headers for API requests
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add API key header when available
            if (process.env.VITE_API_KEY) {
              proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_API_KEY}`);
            }
          });
        }
      }
    }
  },
  
  // Asset handling
  assetsInclude: ['**/*.pdf', '**/*.mp4', '**/*.vtt'],
  
  // Public directory for static files
  publicDir: 'public',
  
  // Environment variables prefix
  envPrefix: 'VITE_',
  
  // CSS configuration
  css: {
    // Enable CSS modules if needed in future
    modules: false,
    devSourcemap: true
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['axios']
  }
});
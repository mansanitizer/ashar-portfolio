import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Multi-page app configuration
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'game.html'),
        prep: resolve(__dirname, 'prep.html'),
        playground: resolve(__dirname, 'playground.html'),
        // Project Presentation Pages
        kit: resolve(__dirname, 'projects/kit.html'),
        rabbithole: resolve(__dirname, 'projects/rabbithole.html'),
        foodbuddy: resolve(__dirname, 'projects/foodbuddy.html'),
        pdf_proofreader: resolve(__dirname, 'projects/pdf-proofreader.html'),
        fileops: resolve(__dirname, 'projects/fileops.html'),
        gg_eink: resolve(__dirname, 'projects/gg-eink.html'),
        pirate_dj: resolve(__dirname, 'projects/pirate-dj.html'),
        n8n_automations: resolve(__dirname, 'projects/n8n-automations.html'),
        bored: resolve(__dirname, 'projects/bored.html')
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
    open: true
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
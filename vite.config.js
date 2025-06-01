import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

export default defineConfig({
  base: './',
  define: {
    'process.env.MY_ENV_VAR': JSON.stringify(process.env.MY_ENV_VAR),
    globalThis: 'window',
  },
  plugins: [
    react(),
    rollupNodePolyFill(),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-redux', 'react/jsx-runtime'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      'react-toastify': path.resolve(__dirname, 'node_modules/react-toastify/dist/react-toastify.js')
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    rollupOptions: {
      // plugins: [rollupNodePolyFill()],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'redux-vendor': ['react-redux', '@reduxjs/toolkit'],
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});

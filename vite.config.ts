import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-stuff': ['react', 'react-dom', 'react-router-dom'],
          'nostr-dev-kit': ['@nostr-dev-kit/ndk', '@nostr-dev-kit/ndk-cache-dexie'],
          zustand: ['zustand'],
        },
      },
    },
  },
});

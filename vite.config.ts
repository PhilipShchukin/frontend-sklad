import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist', // важно!
  },
  server: {
    // headers: {
    //   'Content-Security-Policy':
    //     "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http: https: ws: wss:;",
    // },

    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Timing-Allow-Origin': 'https://developer.mozilla.org, https://example.com',
      'Access-Control-Expose-Headers': 'Tauri-Custom-Header',
      'Tauri-Custom-Header': "key1 'value1' 'value2'; key2 'value3'",
    },
  },
});

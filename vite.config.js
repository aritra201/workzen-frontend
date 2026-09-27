import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true,
    // ngrok / tunnel URLs (subdomain changes each session)
    allowedHosts: ['.ngrok-free.app', '.ngrok.io', 'localhost'],
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/country-codes': {
        target: 'https://lawsikho.com',
        changeOrigin: true,
        rewrite: () => '/api/v1/country-code',
      },
    },
  },
});

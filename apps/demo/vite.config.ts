import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { webfontDownload } from 'vite-plugin-webfont-dl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Cal+Sans&family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap',
      'https://fonts.googleapis.com/css2?family=Monda:wght@400..700&display=swap',
    ]),
  ],
  resolve: {
    alias: {
      // ✅ Local alias to the core source code
      '@vonreyher-media/cvrocket': path.resolve(
        __dirname,
        '../../packages/core/src',
      ),
    },
  },
});

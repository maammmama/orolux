import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/orolux/', // Your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        product: resolve(__dirname, 'src/views/store/product.html'),
        cart: resolve(__dirname, 'src/views/store/cart.html'),
        location: resolve(__dirname, 'src/views/store/location.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});

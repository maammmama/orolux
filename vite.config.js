import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Watch_free_20-05-24-main/', // Replace with your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: '/index.html',
        product: '/my-watch-colne/frontend/src/views/store/product.html',
        cart: '/my-watch-colne/frontend/src/views/store/cart.html',
        location: '/my-watch-colne/frontend/src/views/store/location.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});

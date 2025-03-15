import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets'
    }
  },
  build: {
    terserOptions: {
      compress: {
        // 删除所有 console.*
        drop_console: true,
        // 删除所有 debugger
        drop_debugger: true
      }
    }
  },
  // 代理
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.166:8080',
        // target: "https://51212e4e.r22.cpolar.top",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // http://192.168.1.166:8080
  base: './',
});

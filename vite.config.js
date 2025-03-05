import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 导入文件
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})


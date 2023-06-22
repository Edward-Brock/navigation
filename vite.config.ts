import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import * as path from 'path'

// https://vitejs.dev/config/
export default ({mode}) => defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    cors: true, // 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    host: '0.0.0.0',
    // 反向代理配置，注意 rewrite 写法，开始没看文档在这里踩了坑
    proxy: {
      '/api': {
        target: loadEnv(mode, process.cwd()).VITE_APP_SERVER_URL, // 你要跨域访问的网址
        changeOrigin: true,   // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径把路径变成空字符
      },
    },
  },
})

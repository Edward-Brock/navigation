import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import * as path from 'path'
import {createHtmlPlugin} from "vite-plugin-html"

// 这个配置为了在 HTML 中使用环境变量
const getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};

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
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          // 将环境变量 VITE_APP_TITLE 赋值给 title 方便 HTML 页面使用 title 获取系统标题
          title: getViteEnv(mode, "VITE_APP_TITLE"),
          injectScript: `<script type="module" src="src/assets/baidu_tongji_code.js"></script>`,
        },
        tags: [
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: {
              name: 'author',
              content: getViteEnv(mode, "VITE_APP_META_AUTHOR"),
            },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: {
              name: 'copyright',
              content: getViteEnv(mode, "VITE_APP_META_COPYRIGHT"),
            },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: {
              name: 'keywords',
              content: getViteEnv(mode, "VITE_APP_META_KEYWORDS"),
            },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: {
              name: 'description',
              content: getViteEnv(mode, "VITE_APP_META_DESCRIPTION"),
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    cors: true, // 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    host: '0.0.0.0',
    // 反向代理配置，注意 rewrite 写法，开始没看文档在这里踩了坑
    proxy: {
      '/dev-api': {
        target: loadEnv(mode, process.cwd()).VITE_APP_SERVER_URL, // 你要跨域访问的网址
        changeOrigin: true,   // 允许跨域
        ws: true,
        rewrite: (path) => path.replace(/^\/dev-api/, ''), // 重写路径把路径变成空字符
      },
      '/prod-api': {
        target: loadEnv(mode, process.cwd()).VITE_APP_SERVER_URL, // 你要跨域访问的网址
        changeOrigin: true,   // 允许跨域
        ws: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/prod-api/, ''), // 重写路径把路径变成空字符
      },
    },
  },
})

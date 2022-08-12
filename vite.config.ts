import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
} from "vite-plugin-style-import";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    // 按需引入组件
    createStyleImportPlugin({
      resolves: [AndDesignVueResolve()],
    }),
    // 自动导入组件
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  server: {
    host: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});

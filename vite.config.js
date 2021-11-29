import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteSvgIconsPlugin from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "./src")}/`,
    },
  },
  plugins: [
    vue(),
    ViteSvgIconsPlugin({
      iconDirs: [path.resolve("src/assets/svgIcons")],
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://test.playground.osinfra.cn/",
        // target: "http://159.138.2.2:8080",
        changeOrigin: true,
      },
    },
  },
});

import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteSvgIconsPlugin from "vite-plugin-svg-icons";

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
    port: 3456,
    proxy: {
      "/api": {
        target: "https://playground.osinfra.cn/",
        changeOrigin: true,
      },
    },
  },
});

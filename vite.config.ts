// for demo site
import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), react()],
  base: "/react-base-virtual-list",
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
  },
  build: {
    outDir: "dist-demo",
    emptyOutDir: true, // 确保每次打包清空旧文档
  },
});

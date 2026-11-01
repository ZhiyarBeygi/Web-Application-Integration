import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5046",
        changeOrigin: true,
        secure: false,
      },
      "/crm-api": {
        target: "http://localhost:5237",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/crm-api/, ""),
      },
    },
  },
});

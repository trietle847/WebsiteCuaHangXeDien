import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3001,
    open: false,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target:
          process.env.DOCKER_ENV === "true"
            ? process.env.VITE_API_URL || "http://backend:3000"
            : process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

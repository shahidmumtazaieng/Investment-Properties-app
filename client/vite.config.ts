import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  root: __dirname,
  base: "./", // This ensures relative paths for assets
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: false,
      allow: [".."],
    },
  },
});
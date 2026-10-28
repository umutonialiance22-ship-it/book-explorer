import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
    base: "./",
  plugins: [tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        favorites: fileURLToPath(new URL("./favorites.html", import.meta.url)),
        about: fileURLToPath(new URL("./about.html", import.meta.url))
      }
    }
  }
});
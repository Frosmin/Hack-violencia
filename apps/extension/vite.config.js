import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import manifest from "./src/manifest";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(rootDir, "popup.html"),
        dashboard: path.resolve(rootDir, "dashboard.html"),
        education: path.resolve(rootDir, "education.html"),
        evidences: path.resolve(rootDir, "evidences.html"),
        organization: path.resolve(rootDir, "organization.html"),
        options: path.resolve(rootDir, "options.html"),
      },
    },
  },
});

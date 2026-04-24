import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Escudo Digital",
  version: "2.0.0",
  description:
    "Proteccion inteligente contra violencia digital, grooming y acoso en redes sociales.",
  permissions: [
    "storage",
    "activeTab",
    "scripting",
    "tabs",
    "notifications",
    "downloads",
  ],
  host_permissions: [
    "<all_urls>",
  ],
  background: {
    service_worker: "src/core/background/index.js",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/index.js"],
      run_at: "document_idle",
    },
  ],
  action: {
    default_popup: "popup.html",
    default_icon: {
      16: "icons/icon16.png",
      48: "icons/icon48.png",
      128: "icons/icon128.png",
    },
  },
  icons: {
    16: "icons/icon16.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png",
  },
  web_accessible_resources: [
    {
      resources: ["education.html", "organization.html"],
      matches: ["<all_urls>"],
    },
  ],
});

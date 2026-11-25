import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Automatically resolves absolute HTTPS origin for Open Graph / WhatsApp card preview
 * during Vercel builds (`VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL` or `VITE_SITE_URL`).
 */
function ogSiteOriginPlugin(): Plugin {
  const rawOrigin =
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "");
  const cleanOrigin = rawOrigin.replace(/\/+$/, "");

  return {
    name: "og-site-origin",
    transformIndexHtml(html) {
      return html.replace(/__SITE_ORIGIN__/g, cleanOrigin);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), ogSiteOriginPlugin()],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          motion: ["framer-motion"],
          icons: ["lucide-react"],
        },
      },
    },
  },
});

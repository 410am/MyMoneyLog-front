import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // 개발 중에도 SW 돌리고 싶으면 열어
      // devOptions: { enabled: true },
      manifest: {
        name: "MyMoneyLog",
        short_name: "MML",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#111827",
        background_color: "#ffffff",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icons/maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        // API 캐싱(원하면 도메인 맞춰)
        runtimeCaching: [
          {
            urlPattern: "http://localhost:5173/*",
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    headers: {
      // "Cross-Origin-Opener-Policy": "same-origin",
      // "Cross-Origin-Embedder-Policy": "require-corp",
      //배포때는 아래거 쓰면 절대 안됨
      "Cross-Origin-Opener-Policy": "unsafe-none",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
});

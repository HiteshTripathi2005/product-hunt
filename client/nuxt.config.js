// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL || "http://localhost:8080",
    },
  },

  // SSR configuration to prevent hydration mismatches
  ssr: true,

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "shadcn-nuxt",
  ],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },

  // Proxy API requests to backend server
  nitro: {
    routeRules: {
      "/api/**": {
        proxy: `${process.env.BACKEND_URL || "http://localhost:8080"}/api/**`,
      },
    },
  },
});

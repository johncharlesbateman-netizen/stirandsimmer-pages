import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";
// @ts-ignore — plain JS module, no types needed
import { generateSitemap } from "./scripts/generate-sitemap.mjs";
// @ts-ignore — plain JS module, no types needed
import { prerenderRoutes } from "./scripts/prerender.mjs";

// Regenerates public/sitemap.xml from the database before each production build.
const sitemapPlugin = () => ({
  name: "generate-sitemap",
  apply: "build" as const,
  async buildStart() {
    try {
      await generateSitemap();
    } catch (e) {
      console.warn("[sitemap] Generation failed, keeping existing file:", (e as Error).message);
    }
  },
});

// After the build emits dist/, generates one HTML file per public route with
// route-specific <title>, description, canonical and OG tags so crawlers see
// fully-formed metadata in the source HTML.
const prerenderPlugin = () => ({
  name: "prerender-meta",
  apply: "build" as const,
  async closeBundle() {
    try {
      await prerenderRoutes();
    } catch (e) {
      console.warn("[prerender] Generation failed:", (e as Error).message);
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Build-time image variants for bundled assets. Use `?as=srcset` to import
    // a ready-made srcset string, or `?w=600;1200&format=webp&as=picture` for
    // a <picture>-friendly object.
    imagetools({ defaultDirectives: () => new URLSearchParams() }),
    mode === "development" && componentTagger(),
    sitemapPlugin(),
    prerenderPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

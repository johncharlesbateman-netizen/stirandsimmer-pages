# Deploying to Cloudflare Pages

This project is built for static hosting on Cloudflare Pages. The
prerender step (`scripts/prerender.mjs`, invoked from `vite.config.ts`)
emits a fully-formed HTML file for every public route under `dist/`,
so Googlebot and social crawlers see the route-specific `<title>`,
meta tags and JSON-LD in the **initial HTML response** without
running any JavaScript.

## One-time setup

1. Push this repo to GitHub via Lovable's GitHub integration
   (top-right of the editor → **GitHub → Connect to GitHub**).
2. In the Cloudflare dashboard go to **Workers & Pages → Create
   application → Pages → Connect to Git**, pick the repo.
3. Build configuration:
   - **Framework preset:** None (or "Vite")
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (default)
   - **Node version:** 20 (set via env var `NODE_VERSION=20`)
4. Environment variables — copy from local `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

   These are required at build time so `scripts/prerender.mjs` and
   `scripts/generate-sitemap.mjs` can fetch recipes/ratings from the
   database.
5. Add the custom domain `stirandsimmer.co.uk` in **Pages → Custom
   domains**. Cloudflare will automatically manage DNS if the zone is
   on the same account.

## How requests are served

Three files in `public/` (copied verbatim into `dist/`) drive the
hosting behaviour:

- **`_routes.json`** — excludes `/*` from Pages Functions. Every
  request is a pure static-asset hit; no function invocations.
- **`_headers`** — sets `CDN-Cache-Control: no-store` on content
  routes (`/recipes/*`, `/guides/*`, `/`, `/kitchen-atlas`,
  `/meal-planner`) so post-deploy changes appear immediately. Hashed
  assets in `/assets/` get `max-age=31536000, immutable`.
- **`_redirects`** — `/* /index.html 200` is the SPA fallback for
  routes without a prerendered file (admin, auth, dynamic pages).
  Pages tries `<path>`, `<path>/index.html`, `<path>.html` first, so
  this only triggers when nothing else matches.

## Verifying after the first deploy

```sh
npm run verify:live          # checks live URLs for prerendered <title> + JSON-LD
```

The CI workflow at `.github/workflows/verify-live-site.yml` runs the
same check automatically and fails the build if a page comes back
with the generic homepage title or missing Recipe schema.

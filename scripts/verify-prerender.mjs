// Verifies that every prerendered HTML file in dist/ contains the SEO-critical
// tags: <title>, meta description, canonical, og:*, twitter:*. Recipe routes
// must additionally contain a Recipe JSON-LD block.
//
// Exits non-zero when any route fails — wire into CI to catch regressions.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const SITE = "https://stirandsimmer.co.uk";

const REQUIRED = [
  { name: "title", re: /<title>([^<]{5,})<\/title>/i },
  { name: "description", re: /<meta\s+name=["']description["']\s+content=["']([^"']{10,})["']/i },
  { name: "canonical", re: /<link\s+rel=["']canonical["']\s+href=["'](https:\/\/stirandsimmer\.co\.uk[^"']*)["']/i },
  { name: "og:title", re: /<meta\s+property=["']og:title["']\s+content=["'][^"']+["']/i },
  { name: "og:description", re: /<meta\s+property=["']og:description["']\s+content=["'][^"']+["']/i },
  { name: "og:url", re: /<meta\s+property=["']og:url["']\s+content=["'][^"']+["']/i },
  { name: "og:image", re: /<meta\s+property=["']og:image["']\s+content=["'][^"']+["']/i },
  { name: "og:type", re: /<meta\s+property=["']og:type["']\s+content=["'][^"']+["']/i },
  { name: "twitter:card", re: /<meta\s+name=["']twitter:card["']\s+content=["'][^"']+["']/i },
  { name: "twitter:title", re: /<meta\s+name=["']twitter:title["']\s+content=["'][^"']+["']/i },
  { name: "twitter:description", re: /<meta\s+name=["']twitter:description["']\s+content=["'][^"']+["']/i },
  { name: "twitter:image", re: /<meta\s+name=["']twitter:image["']\s+content=["'][^"']+["']/i },
];

function* walkHtml(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      // Skip hashed asset folder.
      if (entry === "assets") continue;
      yield* walkHtml(full);
    } else if (entry.endsWith(".html")) {
      yield full;
    } else if (!entry.includes(".")) {
      // Extensionless files emitted by older prerender modes — sniff for HTML
      // so they're verified too instead of silently skipped.
      try {
        const head = readFileSync(full, "utf-8").slice(0, 256).toLowerCase();
        if (head.includes("<!doctype html") || head.includes("<html")) yield full;
      } catch {}
    }
  }
}

let failed = 0;
let checked = 0;
const failures = [];

for (const file of walkHtml(DIST)) {
  const rel = "/" + relative(DIST, file).replace(/\/?index\.html$/, "");
  const route = rel === "/" ? "/" : rel;
  const html = readFileSync(file, "utf-8");
  checked++;

  const missing = [];
  for (const r of REQUIRED) {
    if (!r.re.test(html)) missing.push(r.name);
  }

  // Canonical must match the route (allow trailing slash differences).
  // Known recipe aliases intentionally canonicalise to their real slug —
  // mirrors RECIPE_PRERENDER_ALIASES in scripts/prerender.mjs.
  const RECIPE_ALIAS_ROUTES = new Set(["/recipes/chorizo-and-chicken-tapa"]);
  const canon = html.match(REQUIRED[2].re)?.[1];
  if (canon && !RECIPE_ALIAS_ROUTES.has(route)) {
    const expectedPath = route === "/" ? "/" : route;
    const canonPath = canon.replace(SITE, "") || "/";
    if (canonPath !== expectedPath) {
      missing.push(`canonical-mismatch(expected ${expectedPath}, got ${canonPath})`);
    }
  }

  // Recipe routes must include Recipe JSON-LD.
  if (route.startsWith("/recipes/") && !route.startsWith("/recipes/category") && !route.startsWith("/recipes/region")) {
    if (!/<script\s+type=["']application\/ld\+json["'][^>]*>[^<]*"@type"\s*:\s*"Recipe"/i.test(html)) {
      missing.push("recipe-jsonld");
    }
  }

  if (missing.length) {
    failed++;
    failures.push({ route, missing });
  }
}

if (failures.length) {
  console.error(`\n[verify-prerender] FAILED — ${failed}/${checked} routes missing tags:\n`);
  for (const f of failures.slice(0, 30)) {
    console.error(`  ${f.route}`);
    console.error(`    missing: ${f.missing.join(", ")}`);
  }
  if (failures.length > 30) console.error(`  …and ${failures.length - 30} more`);
  process.exit(1);
}

console.log(`[verify-prerender] OK — ${checked} routes have all required SEO tags.`);

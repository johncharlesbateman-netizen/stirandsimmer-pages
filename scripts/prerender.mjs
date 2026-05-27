// Build cache bust marker: 2026-05-26 guide-prerender-redeploy-4
// Static meta-only prerender. Runs after Vite emits dist/ at production
// build time and writes one HTML file per public route to dist/{path}/index.html.
//
// Each emitted file is a copy of dist/index.html with the SEO-critical tags
// (title, description, canonical, OG, Twitter, optional JSON-LD) rewritten
// for that specific route, so crawlers (Googlebot, Bingbot, GPTBot,
// ClaudeBot, PerplexityBot) see fully-formed metadata in the source HTML
// without needing to execute JavaScript.

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://stirandsimmer.co.uk";
const DEFAULT_OG = `${SITE}/og-image.jpg`;

// ---------- Static route definitions ----------

const STATIC_ROUTES = [
  {
    path: "/",
    title: "Stir & Simmer | Delicious Recipes for Every Occasion",
    description:
      "Discover easy, flavour-packed recipes for every occasion. From quick weeknight dinners to impressive desserts — Stir & Simmer has something for everyone.",
  },
  {
    path: "/recipes",
    title: "All Recipes | Stir & Simmer",
    description:
      "Browse every recipe on Stir & Simmer — chicken, beef, lamb, fish, pasta, vegetarian and more. Tried and tested in a real kitchen.",
  },
  {
    path: "/collections",
    title: "Recipe Collections | Stir & Simmer",
    description:
      "Curated collections of our favourite recipes — Italian meals, romantic dinners, fish and seafood, sweets, quick and easy and more.",
  },
  {
    path: "/kitchen-atlas",
    title: "Kitchen Atlas — Recipes by Region | Stir & Simmer",
    description:
      "Explore our recipes by cuisine region — Italian, French, British, Indian, Asian and more. A world of flavour from a single kitchen.",
  },
  {
    path: "/guides",
    title: "Cooking Guides | Stir & Simmer",
    description:
      "In-depth cooking guides covering classic techniques, mother sauces, French foundations and more — from a real working kitchen.",
  },
  {
    path: "/guides/mother-sauces",
    title: "The Five French Mother Sauces — A Complete Guide | Stir & Simmer",
    description:
      "A complete guide to the five French mother sauces — béchamel, velouté, espagnole, tomate and hollandaise — with techniques, ratios and uses.",
  },
  {
    path: "/guides/french-techniques",
    title: "Essential French Cooking Techniques | Stir & Simmer",
    description:
      "Master the essential French cooking techniques that underpin classic cuisine — from sautéing and braising to stocks, sauces and emulsions.",
  },
  {
    path: "/guides/garam-masala",
    title: "Garam masala — a cook's guide | Stir & Simmer",
    description:
      "Garam masala demystified — the spices that go in, why they matter, how to toast and grind them, and the mistakes most home cooks make.",
  },
  {
    path: "/guides/how-to-use-spices",
    title: "How to use spices — a beginner's guide | Stir & Simmer",
    description:
      "A beginner's guide to cooking with spices — what they do, how to store them, when to add them, and how to build flavour with confidence.",
  },
  {
    path: "/guides/proper-stock",
    title: "How to make a proper stock — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to making proper stock at home — what goes in, how long to simmer, the difference between white and brown stock, and how to use and store it.",
  },
  {
    path: "/guides/proper-sauce",
    title: "How to make a proper sauce — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to making proper sauces at home — the building blocks, the techniques, and the small details that turn a thin pan liquid into something glossy and memorable.",
  },
  {
    path: "/guides/choosing-pans",
    title: "Choosing the right pan for the job — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to choosing the right pan for the job — the materials, the shapes, and which pans actually earn their place in a home kitchen.",
  },
  {
    path: "/guides/kitchen-knives",
    title: "Kitchen knives — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to kitchen knives — the blades worth owning, how to hold them, how to keep them sharp, and how to choose ones that will last a lifetime.",
  },
  {
    path: "/guides/understanding-olive-oil",
    title: "Understanding olive oil — a cook's guide | Stir & Simmer",
    description:
      "A practical guide to olive oil — what the labels mean, how it's made, when to cook with it, when to finish with it, and which bottles to buy in the UK.",
  },
  {
    path: "/guides/how-to-cook-pasta",
    title: "How to cook pasta properly — a cook's guide | Stir & Simmer",
    description:
      "How to cook pasta properly — choosing the shape, salting the water, timing it right, saving the cooking water and finishing it in the sauce.",
  },
  {
    path: "/guides/how-to-make-bread",
    title: "How to make bread at home — a beginner's guide | Stir & Simmer",
    description:
      "A beginner's guide to baking bread at home — the four ingredients, the flours, the yeasts, the method, the mistakes, and five loaves every home baker should try.",
  },
  {
    path: "/guides/what-to-cook-in-summer",
    title: "What to cook in summer — a seasonal guide | Stir & Simmer",
    description:
      "A seasonal guide to summer cooking in the UK — what's in season, how to build a proper salad, grilling done well, summer herbs, soft fruit, and five dishes every cook should know.",
  },

  {
    path: "/meal-planner",
    title: "7-Day Meal Planner | Stir & Simmer",
    description:
      "Plan a week of dinners in minutes — our free 7-day meal planner picks recipes for you, builds a shopping list and exports it to your supermarket basket.",
  },
  {
    path: "/about",
    title: "About Stir & Simmer",
    description:
      "Stir & Simmer is a UK recipe site sharing tried-and-tested dishes from a real working kitchen — from quick weeknight dinners to dinner-party showpieces.",
  },
  {
    path: "/contact",
    title: "Contact Stir & Simmer",
    description:
      "Got a question, a recipe request or just want to say hello? Drop us a line — we'd love to hear from you.",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Stir & Simmer",
    description:
      "How Stir & Simmer collects, uses and protects your personal data, in line with the UK GDPR and the Data Protection Act 2018.",
  },
];

// Recipe-tile category pages (mirrors src/lib/recipe-tiles.ts).
const CATEGORY_TILES = [
  { slug: "all", title: "All recipes | Stir & Simmer", description: "Browse every recipe on Stir & Simmer — chicken, beef, lamb, fish, pasta, vegetarian and more. All free, all tried and tested." },
  { slug: "chicken", title: "Chicken recipes — easy and delicious | Stir & Simmer", description: "Discover our collection of tried and tested chicken recipes — from quick weeknight dinners to impressive weekend dishes. All free to browse." },
  { slug: "beef", title: "Beef recipes | Stir & Simmer", description: "Hearty beef recipes for every occasion — slow braises, roasts, ragùs and more. Tried and tested in a real kitchen." },
  { slug: "lamb", title: "Lamb recipes | Stir & Simmer", description: "Tender lamb recipes — slow roasts, fragrant curries and Mediterranean braises. Tried and tested in a real kitchen." },
  { slug: "fish-and-seafood", title: "Fish and seafood recipes | Stir & Simmer", description: "Fresh and flavourful fish and seafood recipes from Stir & Simmer. From simple weeknight salmon to impressive dinner party dishes." },
  { slug: "pork", title: "Pork recipes | Stir & Simmer", description: "Tried and tested pork recipes — from glazed fillets and crackling roasts to fragrant stir-fries and slow-braised casseroles." },
  { slug: "quick-meals", title: "Quick meal recipes — ready in 30 minutes or less | Stir & Simmer", description: "Fast, flavourful and fuss-free — our quick meal recipes are ready in 30 minutes or less. Perfect for busy weeknights." },
  { slug: "spicy", title: "Spicy recipes for heat lovers | Stir & Simmer", description: "Bold, fiery and full of flavour — our spicy recipe collection for those who like a little heat in the kitchen." },
  { slug: "pasta-and-rice", title: "Pasta and rice recipes | Stir & Simmer", description: "Comforting pasta and rice recipes — from rich ragùs and silky carbonara to fragrant pilafs and biryanis." },
  { slug: "puddings-and-desserts", title: "Pudding and dessert recipes | Stir & Simmer", description: "Velvety crème brûlée, light soufflés, buttery scones and decadent chocolate cakes — sweet recipes for every occasion." },
  // Legacy slugs still present in the sitemap.
  { slug: "seafood", title: "Fish and seafood recipes | Stir & Simmer", description: "Fresh and flavourful fish and seafood recipes from Stir & Simmer." },
  { slug: "pasta", title: "Pasta recipes | Stir & Simmer", description: "Comforting pasta recipes — from rich ragùs and silky carbonara to fresh tomato sauces." },
  { slug: "lunch-suggestions", title: "Lunch ideas | Stir & Simmer", description: "Easy, flavour-packed lunch ideas — from sandwiches and salads to warming bowls." },
  { slug: "sweets", title: "Sweet recipes | Stir & Simmer", description: "Sweet recipes from Stir & Simmer — cakes, biscuits, puddings and desserts." },
];

// Collection pages (mirrors src/lib/collections.ts).
const COLLECTIONS = [
  { slug: "italian-meals", title: "Italian Meals", description: "From silky carbonara to creamy risotto and slow-cooked ragù — classic Italian dishes you can make at home." },
  { slug: "romantic-meals", title: "Romantic Meals", description: "Fillet steaks, hand-dived scallops, soufflés and other show-stoppers for date night and celebrations." },
  { slug: "fish-and-seafood", title: "Fish & Seafood", description: "Pan-fried scallops, prawn linguine, herb-crusted salmon and more — bright, flavourful seafood dishes." },
  { slug: "sweets-and-desserts", title: "Sweets & Desserts", description: "Crème brûlée, sticky toffee pudding, soufflés and decadent cakes — sweet endings for every occasion." },
  { slug: "quick-and-easy", title: "Quick & Easy", description: "Minimal prep, short ingredient lists and simple techniques — for when you need dinner fast." },
  { slug: "baking-and-bread", title: "Baking & Bread", description: "Warm crusty bread, buttery scones, light sponges and crisp biscuits — straight from the oven." },
  // Listed in sitemap but not currently in collections.ts — generic copy.
  { slug: "weeknight-suppers", title: "Weeknight Suppers", description: "Easy weeknight dinners that come together fast without compromising on flavour." },
  { slug: "healthy-eating", title: "Healthy Eating", description: "Bright, balanced recipes that prioritise vegetables, lean proteins and whole grains." },
];

// Region pages (mirrors src/lib/cuisine-regions.ts).
const REGIONS = [
  { slug: "italian", label: "Italian" },
  { slug: "french", label: "French" },
  { slug: "british", label: "British" },
  { slug: "indian", label: "Indian" },
  { slug: "asian", label: "Asian" },
  { slug: "spicy", label: "Spicy" },
  { slug: "seasonal", label: "Seasonal" },
  { slug: "comfort", label: "Comfort" },
];

const RECIPE_PRERENDER_ALIASES = {
  "chorizo-and-chicken-tapas": ["chorizo-and-chicken-tapa"],
};

// ---------- HTML rewriting ----------

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Rewrites the SEO-critical tags inside a copy of dist/index.html.
 * Removes any existing <title>, description / canonical / og:* / twitter:*
 * tags, then inserts a fresh block tailored to this route.
 *
 * For the homepage, also injects a static <img id="lcp-hero"> sibling of
 * #root so the LCP candidate paints with the HTML parser (~1.2 s on mobile)
 * instead of waiting for React to mount (~2.5 s+). The element is hidden by
 * the React Index page once its own hero <img> is mounted.
 */
function pinterestPortrait(src) {
  if (!src) return src;
  // Supabase Storage public object → render endpoint with 1000x1500 cover
  if (src.includes("/storage/v1/object/public/") || src.includes("/storage/v1/render/image/public/")) {
    const base = src.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}format=webp&width=1000&height=1500&quality=80&resize=cover`;
  }
  // Wix media URL with transform segment
  if (src.includes("static.wixstatic.com")) {
    return src.replace(
      /\/v1\/(fill|fit|crop|scale_to_fill|scale_to_fit)\/[^/]+/i,
      (_m, mode) => `/v1/${mode}/w_1000,h_1500,al_c,q_80,enc_auto`,
    );
  }
  return src;
}

function buildPrerenderedHtml(template, meta) {
  const { url, title, description, image = DEFAULT_OG, type = "website", jsonLd, injectHero } = meta;
  const pinImage = pinterestPortrait(image);

  // Strip existing SEO tags from the source template.
  // Title tags can come back with attributes (for example Helmet's
  // data-rh marker), so match any <title ...> variant before injecting
  // the fresh route-specific title. This keeps guides and recipes on the
  // same reliable replacement path.
  let html = template
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']pinterest:[^"']+["'][^>]*>/gi, "");

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="${escapeHtml(type)}" />`,
    `<meta property="og:site_name" content="Stir &amp; Simmer" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@StirAndSimmer" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<meta name="pinterest:image" content="${escapeHtml(pinImage)}" />`,
    `<meta name="pinterest:description" content="${escapeHtml(description)}" />`,
  ];


  if (jsonLd) {
    const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    for (const block of blocks) {
      tags.push(
        `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, "\\u003c")}</script>`,
      );
    }
  }

  html = html.replace(/<\/head>/i, `${tags.join("\n    ")}\n  </head>`);

  if (injectHero) {
    // Self-hosted hero (same origin as the HTML). Files live under
    // /public/hero/ and are emitted at build time by the original Pexels
    // download → sharp WebP pipeline. Keeping this same-origin lets the
    // browser reuse the HTML connection and skips the ~1 s third-party
    // DNS+TLS+CDN-render hop that was dominating LCP.
    const srcset = [480, 768, 1024, 1280, 1600].map((w) => `/hero/hero-${w}.webp ${w}w`).join(", ");
    const heroImg = `<img id="lcp-hero" src="/hero/hero-1280.webp" srcset="${srcset}" sizes="100vw" alt="Rustic table laid with freshly cooked dishes, herbs and warm natural light" fetchpriority="high" decoding="async" width="1600" height="1067" />`;
    // Bundled dark overlay so the bootstrap image reads correctly against
    // light text — replicates the React hero's `bg-black/60` so the page
    // looks identical with or without the React img above it.
    const heroOverlay = `<div id="lcp-hero-overlay" aria-hidden="true"></div>`;
    // Inserted before #root so the LCP image is in the initial paint tree.
    html = html.replace(
      /<div id="root"><\/div>/,
      `${heroImg}\n    ${heroOverlay}\n    <div id="root"></div>`,
    );
  }

  // -------------------------------------------------------------------
  // Cookie consent banner — fully static + vanilla JS.
  //
  // CLS-wise, the cheapest banner is one that is present in the first
  // paint and never re-inserted. So we render the banner here (matching
  // the React component's visuals) and wire its buttons with a tiny
  // inline script: Accept / Reject write localStorage and remove the
  // node; Manage preferences toggles the secondary view. The matching
  // React component (src/components/CookieConsent.tsx) becomes a no-op
  // in production via the window.__hasStaticCookieBanner flag below.
  // -------------------------------------------------------------------
  const cookieSkeleton = `
    <div id="cc-static" role="dialog" aria-live="polite" aria-label="Cookie consent" style="position:fixed;bottom:0;left:0;right:0;z-index:55;padding:0.75rem 1rem 1rem;">
      <div style="margin:0 auto;max-width:48rem;border-radius:0.5rem;border:1px solid rgba(245,234,214,0.12);box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);padding:1rem 1.25rem;background-color:#1a0e00;color:#f5ead6;">
        <div id="cc-main" style="display:flex;flex-direction:column;gap:1rem;">
          <div style="flex:1;font-size:0.875rem;line-height:1.6;color:#f5ead6;">
            We use cookies to improve your experience, analyse traffic and show relevant content. See our <a href="/privacy" style="color:#f5ead6;text-decoration:underline;text-underline-offset:2px;">privacy policy</a>.
          </div>
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1.25rem;">
            <button type="button" data-cc-action="prefs" style="background:none;border:0;padding:0;font-size:0.875rem;text-decoration:underline;text-underline-offset:2px;color:rgba(245,234,214,0.7);cursor:pointer;font-family:inherit;">Manage preferences</button>
            <button type="button" data-cc-action="reject" style="background:none;border:0;padding:0;font-size:0.875rem;text-decoration:underline;text-underline-offset:2px;color:rgba(245,234,214,0.7);cursor:pointer;font-family:inherit;">Reject all</button>
            <button type="button" data-cc-action="accept" style="display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:0.375rem;padding:0.625rem 1.25rem;font-size:0.875rem;font-weight:600;letter-spacing:0.025em;background-color:#C97B1A;color:#1a0e00;cursor:pointer;font-family:inherit;">Accept all</button>
          </div>
        </div>
        <div id="cc-prefs" style="display:none;font-size:0.875rem;color:#f5ead6;">
          <h2 style="font-family:'Boska','Boska Fallback',Georgia,serif;font-size:1.125rem;margin:0 0 0.5rem;color:#f5ead6;">Cookie preferences</h2>
          <ul style="margin:0 0 0.75rem;padding-left:1rem;">
            <li style="margin-bottom:0.25rem;"><strong>Essential</strong> <span style="color:rgba(245,234,214,0.75);">&mdash; always on. Required for the site to work.</span></li>
            <li><strong>Analytics &amp; marketing</strong> <span style="color:rgba(245,234,214,0.75);">&mdash; help us improve the site and show relevant content.</span></li>
          </ul>
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1.25rem;">
            <button type="button" data-cc-action="back" style="background:none;border:0;padding:0;font-size:0.875rem;text-decoration:underline;text-underline-offset:2px;color:rgba(245,234,214,0.7);cursor:pointer;font-family:inherit;">Back</button>
            <button type="button" data-cc-action="reject" style="background:none;border:0;padding:0;font-size:0.875rem;text-decoration:underline;text-underline-offset:2px;color:rgba(245,234,214,0.7);cursor:pointer;font-family:inherit;">Essential only</button>
            <button type="button" data-cc-action="accept" style="display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:0.375rem;padding:0.625rem 1.25rem;font-size:0.875rem;font-weight:600;letter-spacing:0.025em;background-color:#C97B1A;color:#1a0e00;cursor:pointer;font-family:inherit;">Accept all</button>
          </div>
        </div>
      </div>
    </div>
    <script>(function(){window.__hasStaticCookieBanner=true;var K='ss_cookie_consent_v1';try{var v=localStorage.getItem(K);if(v==='all'||v==='essential'){var e=document.getElementById('cc-static');if(e)e.parentNode.removeChild(e);return;}}catch(e){}var root=document.getElementById('cc-static');if(!root)return;root.addEventListener('click',function(ev){var t=ev.target;while(t&&t!==root&&!t.getAttribute('data-cc-action'))t=t.parentNode;if(!t||t===root)return;var a=t.getAttribute('data-cc-action');if(a==='prefs'){document.getElementById('cc-main').style.display='none';document.getElementById('cc-prefs').style.display='block';}else if(a==='back'){document.getElementById('cc-prefs').style.display='none';document.getElementById('cc-main').style.display='flex';}else if(a==='accept'||a==='reject'){try{localStorage.setItem(K,a==='accept'?'all':'essential');}catch(e){}root.parentNode&&root.parentNode.removeChild(root);}});})();</script>`;
  html = html.replace(/<\/body>/i, `${cookieSkeleton}\n  </body>`);


  return html;
}

function buildBreadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

const HOME_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stir & Simmer",
    url: SITE,
    description:
      "Curated recipes crafted with fresh ingredients, bold flavours, and a whole lot of love.",
    publisher: { "@type": "Organization", name: "Stir & Simmer", url: SITE },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/recipes?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stir & Simmer",
    url: SITE,
    logo: `${SITE}/og-image.jpg`,
    description: "A UK recipe site with free curated recipes for every occasion.",
  },
];

function writeRoute(distDir, template, meta) {
  const html = buildPrerenderedHtml(template, meta);
  // Root route stays as dist/index.html.
  // For every other route, emit BOTH `{path}/index.html` and `{path}.html`.
  // The live host is currently serving the SPA shell for some clean URLs even
  // though the nested prerendered file exists, so we provide the flat `.html`
  // twin as a compatibility fallback for hosts that resolve `/foo/bar` to
  // `/foo/bar.html` before SPA fallback.
  if (meta.path === "/") {
    writeFileSync(resolve(distDir, "index.html"), html, "utf-8");
    return;
  }

  const nestedOutPath = resolve(distDir, `.${meta.path}/index.html`);
  const flatOutPath = resolve(distDir, `.${meta.path}.html`);

  mkdirSync(dirname(nestedOutPath), { recursive: true });
  mkdirSync(dirname(flatOutPath), { recursive: true });
  writeFileSync(nestedOutPath, html, "utf-8");
  writeFileSync(flatOutPath, html, "utf-8");
}

// Mirrors src/lib/recipe-schema.ts so the prerendered HTML carries the
// same rich Recipe JSON-LD that the client renders post-hydration —
// crucial for Google's Rich Results Test, which does not execute JS.
const CATEGORY_CALORIES = {
  chicken: 480, beef: 620, lamb: 640, pork: 580, spicy: 520,
  seafood: 420, pasta: 560, lunch_suggestions: 380, sweets: 340,
  desserts: 380, starters: 260, sides: 220, salads: 280, soups: 260,
  cakes: 360, breakfast: 420, drinks: 140, sandwiches: 460, mains: 540,
};
const isoDuration = (m) => (m && m > 0 ? `PT${m}M` : undefined);

function normaliseIngredient(i) {
  if (typeof i === "string") return i.trim();
  if (i && typeof i === "object") {
    const amount = i.amount == null ? "" : String(i.amount).trim();
    const item = typeof i.item === "string" ? i.item.trim() : "";
    return `${amount} ${item}`.trim();
  }
  return "";
}
function normaliseInstruction(s) {
  if (typeof s === "string") return s;
  if (s && typeof s === "object") return String(s.text ?? s.step ?? s.instruction ?? "");
  return String(s ?? "");
}

function buildRecipeJsonLd(r, aggregate) {
  const pageUrl = `${SITE}/recipes/${r.slug}`;
  const ingredients = (r.ingredients ?? []).map(normaliseIngredient).filter(Boolean);
  const instructions = (r.instructions ?? []).map(normaliseInstruction).filter((s) => s.trim());
  const prep = r.prep_time_minutes;
  const cook = r.cook_time_minutes;
  const total = (prep || 0) + (cook || 0);
  const category = r.categories?.[0] ?? r.category ?? "";
  const calories = CATEGORY_CALORIES[(category || "").toLowerCase()] || 450;

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.title,
    description: r.description ?? "",
    ...(r.image_url && { image: [r.image_url] }),
    url: pageUrl,
    author: { "@type": "Organization", name: "Stir & Simmer", url: SITE },
    ...(r.created_at && { datePublished: r.created_at }),
    ...(r.updated_at && { dateModified: r.updated_at }),
    ...(isoDuration(prep) && { prepTime: isoDuration(prep) }),
    ...(isoDuration(cook) && { cookTime: isoDuration(cook) }),
    ...(total > 0 && { totalTime: `PT${total}M` }),
    ...(r.servings && { recipeYield: `${r.servings} servings` }),
    recipeCategory: category,
    recipeCuisine: r.cuisine || "British",
    recipeIngredient: ingredients,
    recipeInstructions: instructions.map((step, i) => ({
      "@type": "HowToStep",
      name: `Step ${i + 1}`,
      position: i + 1,
      text: step,
      url: `${pageUrl}#step-${i + 1}`,
      ...(r.image_url && { image: r.image_url }),
    })),
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${calories} kcal`,
      servingSize: r.servings ? `1 of ${r.servings} servings` : "1 serving",
    },
    ...(aggregate && aggregate.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(aggregate.average.toFixed(2)),
        ratingCount: aggregate.count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}


// ---------- Main entry ----------

export async function prerenderRoutes() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const distDir = resolve(__dirname, "../dist");
  const templatePath = resolve(distDir, "index.html");

  let template;
  try {
    template = readFileSync(templatePath, "utf-8");
  } catch (e) {
    console.warn("[prerender] dist/index.html missing — skipping.");
    return;
  }

  // ---------- Inline the CSS bundle ----------
  // Vite emits a single render-blocking stylesheet at /assets/index-*.css
  // (~17 KiB transferred, ~80 KiB unminified). Lighthouse measured 400 ms
  // of LCP delay waiting for it. Inlining it into <head> removes the
  // critical-path request entirely so the prerendered hero <img> can paint
  // as soon as the HTML lands — no extra round-trip.
  //
  // Trade-off: we ship the same CSS in every prerendered HTML file (~5 KiB
  // gzipped each). For 350 prerendered routes that's ~1.7 MB of total
  // duplicated bytes across the whole site, but each individual cold-load
  // only pays for one copy — a clear win for LCP.
  try {
    const assetsDir = resolve(distDir, "assets");
    const cssFile = readdirSync(assetsDir).find(
      (f) => f.startsWith("index-") && f.endsWith(".css"),
    );
    if (cssFile) {
      const cssPath = resolve(assetsDir, cssFile);
      const css = readFileSync(cssPath, "utf-8");
      const cssHref = `/assets/${cssFile}`;
      // Strip the original render-blocking <link rel="stylesheet"> for this
      // bundle (Vite inserts it in <head>) and replace with an inline
      // <style> block. We keep a deferred <link> in <noscript> so users
      // without JS still get the styles via the standard mechanism, and a
      // preload-as-style swap so the browser caches the external file for
      // subsequent navigations (where CSS hashing means it'll match).
      const linkRe = new RegExp(
        `<link\\s+rel=["']stylesheet["']\\s+[^>]*href=["']${cssHref.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        )}["'][^>]*>`,
        "i",
      );
      // Inline the bundle and DROP the external <link> entirely from the
      // critical path — the styles are already in the HTML, so any extra
      // request just delays render (Lighthouse flagged the preload-swap
      // variant as 340 ms of render-blocking). <noscript> keeps a
      // standards-compliant fallback for the no-JS path.
      const inlined =
        `<style data-inlined-bundle>${css}</style>\n    ` +
        `<noscript><link rel="stylesheet" href="${cssHref}" /></noscript>`;
      if (linkRe.test(template)) {
        template = template.replace(linkRe, inlined);
        console.log(`[prerender] Inlined ${(css.length / 1024).toFixed(1)} KiB of CSS from ${cssFile}.`);
      } else {
        console.warn(`[prerender] CSS <link> for ${cssHref} not found in template — skipping inline.`);
      }
    } else {
      console.warn("[prerender] No index-*.css found in dist/assets — skipping inline.");
    }
  } catch (e) {
    console.warn("[prerender] CSS inline failed:", e.message);
  }


  const routes = [];

  for (const r of STATIC_ROUTES) {
    const url = `${SITE}${r.path === "/" ? "/" : r.path}`;
    const route = { path: r.path, url, title: r.title, description: r.description };
    if (r.path === "/") {
      route.jsonLd = HOME_JSONLD;
      route.injectHero = true;
    } else {
      route.jsonLd = buildBreadcrumb([
        { name: "Home", url: `${SITE}/` },
        { name: r.title.split(" | ")[0].split(" — ")[0].trim(), url },
      ]);
    }
    routes.push(route);
  }

  for (const t of CATEGORY_TILES) {
    const url = `${SITE}/recipes/category/${t.slug}`;
    routes.push({
      path: `/recipes/category/${t.slug}`,
      url,
      title: t.title,
      description: t.description,
      jsonLd: buildBreadcrumb([
        { name: "Home", url: `${SITE}/` },
        { name: "Recipes", url: `${SITE}/recipes` },
        { name: t.title.split(" | ")[0].split(" — ")[0].trim(), url },
      ]),
    });
  }

  for (const c of COLLECTIONS) {
    const url = `${SITE}/collections/${c.slug}`;
    routes.push({
      path: `/collections/${c.slug}`,
      url,
      title: `${c.title} — Recipe Collection | Stir & Simmer`,
      description: c.description,
      jsonLd: buildBreadcrumb([
        { name: "Home", url: `${SITE}/` },
        { name: "Collections", url: `${SITE}/collections` },
        { name: c.title, url },
      ]),
    });
  }

  for (const r of REGIONS) {
    const url = `${SITE}/recipes/region/${r.slug}`;
    routes.push({
      path: `/recipes/region/${r.slug}`,
      url,
      title: `${r.label} recipes | Stir & Simmer`,
      description: `Explore our collection of ${r.label} recipes — tried and tested in a real kitchen, free to browse.`,
      jsonLd: buildBreadcrumb([
        { name: "Home", url: `${SITE}/` },
        { name: "Kitchen Atlas", url: `${SITE}/kitchen-atlas` },
        { name: `${r.label} recipes`, url },
      ]),
    });
  }

  // Recipe pages — fetched from the database.
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  let recipeCount = 0;
  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { data: recipes, error } = await supabase
        .from("recipes")
        .select(
          "id, slug, title, description, image_url, categories, cuisine:cuisine_region, seo_title, seo_description, ingredients, instructions, prep_time_minutes, cook_time_minutes, servings, created_at, updated_at",
        )
        .eq("published", true);
      if (error) throw error;

      // Aggregate ratings per recipe so the prerendered JSON-LD carries
      // aggregateRating for Google's Rich Results Test without needing JS.
      const aggregates = new Map();
      try {
        const { data: ratings } = await supabase
          .from("recipe_ratings")
          .select("recipe_id, rating");
        for (const row of ratings ?? []) {
          const cur = aggregates.get(row.recipe_id) || { sum: 0, count: 0 };
          cur.sum += row.rating;
          cur.count += 1;
          aggregates.set(row.recipe_id, cur);
        }
      } catch (e) {
        console.warn("[prerender] Ratings fetch failed:", e.message);
      }

      for (const r of recipes ?? []) {
        const title = r.seo_title || `${r.title} | Stir & Simmer`;
        const description =
          r.seo_description ||
          (r.description ? r.description.slice(0, 155) : `${r.title} — a tried-and-tested recipe from Stir & Simmer.`);
        const recipeUrl = `${SITE}/recipes/${r.slug}`;
        const agg = aggregates.get(r.id);
        const aggregate = agg && agg.count > 0
          ? { average: agg.sum / agg.count, count: agg.count }
          : null;
        routes.push({
          path: `/recipes/${r.slug}`,
          url: recipeUrl,
          outputMode: "exact-path",
          title,
          description,
          image: r.image_url || DEFAULT_OG,
          type: "article",
          jsonLd: [
            buildRecipeJsonLd(r, aggregate),
            buildBreadcrumb([
              { name: "Home", url: `${SITE}/` },
              { name: "Recipes", url: `${SITE}/recipes` },
              { name: r.title, url: recipeUrl },
            ]),
          ],
        });
        for (const alias of RECIPE_PRERENDER_ALIASES[r.slug] ?? []) {
          routes.push({
            path: `/recipes/${alias}`,
            url: recipeUrl,
            outputMode: "exact-path",
            title,
            description,
            image: r.image_url || DEFAULT_OG,
            type: "article",
            jsonLd: [
              buildRecipeJsonLd({ ...r, slug: r.slug }, aggregate),
              buildBreadcrumb([
                { name: "Home", url: `${SITE}/` },
                { name: "Recipes", url: `${SITE}/recipes` },
                { name: r.title, url: recipeUrl },
              ]),
            ],
          });
        }
        recipeCount++;
      }
    } catch (e) {
      console.warn("[prerender] Recipe fetch failed:", e.message);
    }
  } else {
    console.warn("[prerender] Missing Supabase env vars — skipping recipe routes.");
  }

  for (const route of routes) writeRoute(distDir, template, route);

  console.log(
    `[prerender] Wrote ${routes.length} HTML files (${STATIC_ROUTES.length} static, ${CATEGORY_TILES.length} categories, ${COLLECTIONS.length} collections, ${REGIONS.length} regions, ${recipeCount} recipes).`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderRoutes().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
// rebuild trigger: 2026-05-26T09:21:00Z

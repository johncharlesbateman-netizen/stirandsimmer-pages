# GitHub Connection & Repository Guide — Stir & Simmer

This guide walks you through connecting your Lovable project to GitHub so you can deploy it to Cloudflare Pages (or any other host).

---

## What you're doing

You are pushing the **entire Stir & Simmer codebase** from Lovable to a new GitHub repository in your account (`johncharlesbateman-netizen`). Once the repo exists, you can connect it to Cloudflare Pages for deployment.

---

## Step 1: Open the GitHub connection panel

1. In the Lovable editor, look at the **top-right corner** of the screen.
2. Click the **GitHub** button.
3. A panel will open with the option **"Connect to GitHub"**.

---

## Step 2: Authorise Lovable to access your GitHub account

1. Click **"Connect to GitHub"**.
2. You will be redirected to GitHub to authorise the **Lovable GitHub App**.
3. Sign in to GitHub as **`johncharlesbateman-netizen`** if prompted.
4. On the authorisation screen, **grant access to your personal account**.
   - You do **not** need to grant access to any organisations unless you want the repo there.
5. You will be redirected back to Lovable.

---

## Step 3: Create the repository

1. Back in Lovable, the GitHub panel now shows a **"Create repository"** option.
2. Click **"Create repository"**.
3. In the repository name field, enter exactly:
   ```
   stirandsimmer
   ```
4. Choose **Public** or **Private** (either works for Cloudflare Pages).
5. Click **"Create"**.

Lovable will now push the entire project to `github.com/johncharlesbateman-netizen/stirandsimmer`.

---

## Step 4: Verify the push succeeded

1. Open a browser tab and go to:
   ```
   https://github.com/johncharlesbateman-netizen/stirandsimmer
   ```
2. You should see the repository with all project files, including:
   - `docs/deploy-cloudflare-pages.md`
   - `public/_routes.json`
   - `public/_headers`
   - `public/_redirects`
   - `scripts/prerender.mjs`
   - `src/` components and pages

If the page shows a 404, wait 30 seconds and refresh — the initial push may still be in progress.

---

## Step 5: Enable auto-sync (recommended)

Once connected, Lovable will **automatically push every change** you make in the editor to the GitHub repository. You do not need to manually sync.

To confirm auto-sync is on:
1. Click the **GitHub** button in the top-right again.
2. Look for a green checkmark or "Synced" status.

---

## What's in the repository?

Everything needed to build and deploy Stir & Simmer:

| File / Folder | Purpose |
|---------------|---------|
| `docs/deploy-cloudflare-pages.md` | Full Cloudflare Pages deployment instructions |
| `public/_routes.json` | Tells Cloudflare Pages to serve static files (no Functions) |
| `public/_headers` | Cache-control rules for content vs. assets |
| `public/_redirects` | SPA fallback — ensures prerendered pages are served correctly |
| `scripts/prerender.mjs` | Generates static HTML for every recipe, guide, and page |
| `scripts/generate-sitemap.mjs` | Builds sitemap files for SEO |
| `src/` | All React components, pages, and styling |
| `.github/workflows/` | CI checks for prerendered output and SEO validation |

---

## Next step: Deploy to Cloudflare Pages

Once the repository exists in your GitHub account, follow the deployment guide:

```
docs/deploy-cloudflare-pages.md
```

Or read it directly in the repo after Step 4.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Can't authorise GitHub" | Make sure you are signed in to GitHub as `johncharlesbateman-netizen`, not a different account. |
| "Repo name already exists" | Either pick a different name, or delete the existing repo on GitHub first. |
| "Repository not found" after creation | Wait 30–60 seconds and refresh. The first push can take a moment. |
| Changes not appearing on GitHub | Click the GitHub button in Lovable and check for a "Sync now" or "Push" option. |

---

## Quick reference

- **Your GitHub account:** `johncharlesbateman-netizen`
- **Repository name:** `stirandsimmer`
- **Expected URL after creation:** `https://github.com/johncharlesbateman-netizen/stirandsimmer`
- **Deployment target:** Cloudflare Pages (see `docs/deploy-cloudflare-pages.md`)

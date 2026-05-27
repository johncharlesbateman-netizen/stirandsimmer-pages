import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const siteUrl = "https://stirandsimmer.co.uk";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("title, description, image_url, slug")
    .eq("published", true)
    .eq("slug", slug)
    .single();

  if (error || !recipe) {
    return new Response("Recipe not found", { status: 404 });
  }

  const pageUrl = `${siteUrl}/recipes/${recipe.slug}`;
  const title = recipe.title;
  const description = recipe.description;
  const image = recipe.image_url || "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)} — Stir &amp; Simmer</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${pageUrl}" />
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ""}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ""}
  <link rel="canonical" href="${pageUrl}" />
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${pageUrl}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

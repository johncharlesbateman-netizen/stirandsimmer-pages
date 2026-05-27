// Image transformation helpers for remote image hosts we serve from.
// Currently handles Supabase Storage and Wix media — both expose URL-based
// transformations to deliver WebP + correctly sized variants, which cuts
// LCP and bandwidth dramatically on mobile.
//
// Docs:
//   Supabase: https://supabase.com/docs/guides/storage/serving/image-transformations
//   Wix: https://dev.wix.com/docs/sdk/articles/media/images

const SUPABASE_RENDER_PATH = "/storage/v1/render/image/public/";
const SUPABASE_OBJECT_PATH = "/storage/v1/object/public/";
const WIX_HOST = "static.wixstatic.com";

const isSupabaseStorageUrl = (url: string): boolean =>
  url.includes(SUPABASE_OBJECT_PATH) || url.includes(SUPABASE_RENDER_PATH);

const isWixUrl = (url: string): boolean => url.includes(WIX_HOST);

const toRenderUrl = (url: string): string =>
  url.replace(SUPABASE_OBJECT_PATH, SUPABASE_RENDER_PATH);

// Rewrites a Wix media URL's transform segment to request a smaller WebP/AVIF
// variant (via enc_auto, which content-negotiates on the Accept header).
// Wix URLs look like:
//   .../media/<id>~mv2.jpeg/v1/fill/w_3024,h_4032,al_c,q_90/<name>.jpeg
const transformWixUrl = (url: string, opts: TransformOpts): string => {
  const width = opts.width ?? 800;
  const height = opts.height ?? Math.round(width * 0.75);
  const quality = Math.min(Math.max(opts.quality ?? 75, 20), 90);
  // Match /v1/<mode>/<segment>/ — segment is the comma-list of options.
  return url.replace(
    /\/v1\/(fill|fit|crop|scale_to_fill|scale_to_fit)\/[^/]+/i,
    (_m, mode) =>
      `/v1/${mode}/w_${width},h_${height},al_c,q_${quality},enc_auto`,
  );
};

interface TransformOpts {
  width?: number;
  height?: number;
  quality?: number; // 20–100
  resize?: "cover" | "contain" | "fill";
}

/**
 * Build an optimised image URL. For Supabase Storage and Wix media URLs,
 * rewrites the URL to serve a properly sized WebP/AVIF variant. For any
 * other URL (local imports, unknown external CDNs), the original is returned
 * unchanged.
 */
export const optimisedImage = (
  src: string | null | undefined,
  opts: TransformOpts = {},
): string => {
  if (!src) return "";

  if (isWixUrl(src)) {
    return transformWixUrl(src, opts);
  }

  if (!isSupabaseStorageUrl(src)) return src;

  const base = toRenderUrl(src);
  const params = new URLSearchParams();
  params.set("format", "webp");
  if (opts.width) params.set("width", String(opts.width));
  if (opts.height) params.set("height", String(opts.height));
  params.set("quality", String(opts.quality ?? 75));
  params.set("resize", opts.resize ?? "cover");

  return `${base}?${params.toString()}`;
};

/**
 * Build a responsive srcset string at common DPR-aware widths.
 * Pair with a `sizes` attribute for the layout you're using.
 */
export const responsiveSrcSet = (
  src: string | null | undefined,
  widths: number[],
  opts: Omit<TransformOpts, "width"> = {},
): string => {
  if (!src) return "";
  if (!isSupabaseStorageUrl(src) && !isWixUrl(src)) return "";
  return widths
    .map((w) => `${optimisedImage(src, { ...opts, width: w })} ${w}w`)
    .join(", ");
};

/**
 * Pinterest-optimised portrait crop (2:3, 1000x1500). Pinterest favours
 * tall pins; this returns a centre-cropped portrait variant of the source
 * image when the host supports URL-based transforms, otherwise the
 * original URL is returned unchanged.
 */
export const pinterestImage = (src: string | null | undefined): string =>
  optimisedImage(src, { width: 1000, height: 1500, resize: "cover", quality: 80 });


// One-off image optimisation: recompress all JPG/PNG assets in place
// (mozjpeg, quality 72, max 1600px wide) and emit a .webp sibling next to
// each one (quality 70). Re-run any time new bundled assets are added.
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOTS = ["src/assets", "public"];
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 72;
const WEBP_QUALITY = 70;
const PNG_COMPRESSION = 9;

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const isRaster = (f) => /\.(jpe?g|png)$/i.test(f);

async function optimise(file) {
  const ext = path.extname(file).toLowerCase();
  const buf = await fs.readFile(file);
  const before = buf.length;
  const img = sharp(buf, { failOn: "none" });
  const meta = await img.metadata();
  const resize = meta.width && meta.width > MAX_WIDTH
    ? img.clone().resize({ width: MAX_WIDTH, withoutEnlargement: true })
    : img.clone();

  // Rewrite original (jpg/png) with stronger compression.
  let recompressed;
  if (ext === ".png") {
    recompressed = await resize.png({ compressionLevel: PNG_COMPRESSION, palette: true }).toBuffer();
  } else {
    recompressed = await resize.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true }).toBuffer();
  }
  if (recompressed.length < before) {
    await fs.writeFile(file, recompressed);
  }

  // Emit/refresh .webp sibling.
  const webpPath = file.replace(/\.(jpe?g|png)$/i, ".webp");
  const webp = await resize.webp({ quality: WEBP_QUALITY, effort: 5 }).toBuffer();
  await fs.writeFile(webpPath, webp);

  const after = Math.min(recompressed.length, before);
  return { file, before, after, webp: webp.length };
}

const results = [];
for (const root of ROOTS) {
  for await (const f of walk(root)) {
    if (!isRaster(f)) continue;
    try {
      results.push(await optimise(f));
    } catch (e) {
      console.warn("skip", f, e.message);
    }
  }
}

const fmt = (n) => `${(n / 1024).toFixed(0)}KB`;
let totalBefore = 0, totalAfter = 0, totalWebp = 0;
for (const r of results) {
  totalBefore += r.before; totalAfter += r.after; totalWebp += r.webp;
  console.log(`${r.file}  ${fmt(r.before)} → ${fmt(r.after)} (webp ${fmt(r.webp)})`);
}
console.log(`\nTotal: ${fmt(totalBefore)} → ${fmt(totalAfter)} jpg/png,  ${fmt(totalWebp)} webp`);

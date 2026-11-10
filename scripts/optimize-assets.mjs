// Copies the original product screenshots from the sibling repositories into
// this site's public/ directory as optimized WebP files. The source
// repositories are only read, never modified.
//
// Usage: node scripts/optimize-assets.mjs
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projects = path.resolve(root, "..");

const sources = {
  mobileroad: {
    dir: path.join(projects, "MobileRoad", "docs", "images"),
    files: ["home.png", "timeline.png", "feature-modal.png", "ai-audit.png"],
  },
  architecter: {
    dir: path.join(projects, "Architecter", "docs", "screenshots"),
    files: ["proposal-review.jpg", "compare.jpg", "decisions.jpg"],
  },
  codebasexplorer: {
    dir: path.join(projects, "codebasexplorer", "docs", "screenshots"),
    files: ["workspace-ai.jpg", "architecture.jpg", "flows.jpg", "impact.jpg"],
  },
};

const MAX_WIDTH = 1600;

for (const [product, { dir, files }] of Object.entries(sources)) {
  const outDir = path.join(root, "public", "products", product);
  await mkdir(outDir, { recursive: true });
  for (const file of files) {
    const input = path.join(dir, file);
    if (!existsSync(input)) {
      console.warn(`missing: ${input}`);
      continue;
    }
    const output = path.join(outDir, file.replace(/\.(png|jpe?g)$/i, ".webp"));
    const info = await sharp(input)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(output);
    console.log(`${product}/${path.basename(output)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} kB`);
  }
}

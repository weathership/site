// Mirror brand/ assets into web/public/brand/ so they're served at
// stable URLs (/brand/logo/mark/mark.svg, /brand/social/og.png, …).
//
// Runs as a pre-step before `astro dev` and `astro build`. The
// `web/public/brand/` directory is gitignored — this is the deploy
// artifact, not the source.

import { cp, mkdir, copyFile, rm, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(here, "..");
const repoRoot = resolve(webRoot, "..");
const brandSrc = join(repoRoot, "brand");
const brandDst = join(webRoot, "public", "brand");
const publicDir = join(webRoot, "public");

async function ensure(dir) {
  await mkdir(dir, { recursive: true });
}

async function copyTree(src, dst) {
  await rm(dst, { recursive: true, force: true });
  await cp(src, dst, { recursive: true });
}

async function copyIfExists(src, dst) {
  if (!existsSync(src)) return;
  await ensure(dirname(dst));
  await copyFile(src, dst);
}

async function main() {
  if (!existsSync(brandSrc)) {
    console.error(`sync-brand: ${brandSrc} not found`);
    process.exit(1);
  }

  console.log(`sync-brand: ${brandSrc} → ${brandDst}`);
  await copyTree(brandSrc, brandDst);

  // Surface the favicon and OG image at the conventional root paths
  // expected by browsers and social-card scrapers.
  await copyIfExists(
    join(brandSrc, "favicon", "favicon.svg"),
    join(publicDir, "favicon.svg")
  );
  await copyIfExists(
    join(brandSrc, "favicon", "favicon-32.png"),
    join(publicDir, "favicon-32.png")
  );
  await copyIfExists(
    join(brandSrc, "favicon", "favicon-16.png"),
    join(publicDir, "favicon-16.png")
  );
  await copyIfExists(
    join(brandSrc, "favicon", "apple-touch-icon-180.png"),
    join(publicDir, "apple-touch-icon.png")
  );
  await copyIfExists(
    join(brandSrc, "social", "og.png"),
    join(publicDir, "og.png")
  );

  // Surface the CSS tokens at /brand/colors/tokens.css for runtime fetches
  // by the media-kit color page (it also imports the file at build time).
  console.log("sync-brand: tokens.css available at /brand/colors/tokens.css");

  // Round-trip a marker so downstream tooling can detect a successful sync
  await writeFile(
    join(brandDst, ".synced"),
    JSON.stringify({ at: new Date().toISOString() }, null, 2) + "\n"
  );
}

main().catch((err) => {
  console.error("sync-brand failed:", err);
  process.exit(1);
});

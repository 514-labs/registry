import { existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getPipelinesRegistryPath } from "@workspace/registry/pipelines";

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function getCwd() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // scripts/ -> app root
  return join(__dirname, "..");
}

function main() {
  const appRoot = getCwd();
  const registryPath = getPipelinesRegistryPath();
  const publicDir = join(appRoot, "public", "pipeline-logos");
  ensureDir(publicDir);

  const pipelines = readdirSync(registryPath, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith(".")
    )
    .map((d) => d.name);

  for (const id of pipelines) {
    const base = join(registryPath, id, "_meta", "assets", "logo");
    const candidates = [
      { path: base + ".png", ext: ".png" },
      { path: base + ".svg", ext: ".svg" },
      { path: base + ".jpg", ext: ".jpg" },
      { path: base + ".jpeg", ext: ".jpeg" },
      { path: base + ".webp", ext: ".webp" },
    ];
    const found = candidates.find((c) => existsSync(c.path));
    if (found) {
      const dest = join(publicDir, `${id}${found.ext}`);
      copyFileSync(found.path, dest);
    }

    // from/to assets (copy regardless of whether main logo exists)
    const fromBase = join(registryPath, id, "_meta", "assets", "from", "logo");
    const toBase = join(registryPath, id, "_meta", "assets", "to", "logo");
    const variants = [
      { ext: ".svg" },
      { ext: ".png" },
      { ext: ".webp" },
      { ext: ".jpg" },
      { ext: ".jpeg" },
    ];
    const foundFrom = variants
      .map((v) => ({ path: fromBase + v.ext, ext: v.ext }))
      .find((v) => existsSync(v.path));
    if (foundFrom) {
      const destFrom = join(publicDir, `${id}-from${foundFrom.ext}`);
      copyFileSync(foundFrom.path, destFrom);
    }
    const foundTo = variants
      .map((v) => ({ path: toBase + v.ext, ext: v.ext }))
      .find((v) => existsSync(v.path));
    if (foundTo) {
      const destTo = join(publicDir, `${id}-to${foundTo.ext}`);
      copyFileSync(foundTo.path, destTo);
    }
  }
}

main();

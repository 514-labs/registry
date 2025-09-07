import { existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getConnectorsRegistryPath } from "@workspace/registry/connectors";
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

function syncConnectorLogos(appRoot) {
  const registryPath = getConnectorsRegistryPath();
  const publicDir = join(appRoot, "public", "connector-logos");
  ensureDir(publicDir);

  // Read top-level connector directories
  const connectors = readdirSync(registryPath, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith(".")
    )
    .map((d) => d.name);

  for (const connectorId of connectors) {
    const metaAssets = join(registryPath, connectorId, "_meta", "assets");
    const logoBase = join(metaAssets, "logo");
    const candidates = [
      { path: logoBase + ".png", ext: ".png" },
      { path: logoBase + ".svg", ext: ".svg" },
      { path: logoBase + ".jpg", ext: ".jpg" },
      { path: logoBase + ".jpeg", ext: ".jpeg" },
      { path: logoBase + ".webp", ext: ".webp" },
    ];
    const found = candidates.find((c) => existsSync(c.path));
    if (found) {
      const dest = join(publicDir, `${connectorId}${found.ext}`);
      copyFileSync(found.path, dest);
    }
  }
}

function syncPipelineLogos(appRoot) {
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

function main() {
  const appRoot = getCwd();
  syncConnectorLogos(appRoot);
  syncPipelineLogos(appRoot);
}

main();

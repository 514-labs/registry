import { existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getConnectorsRegistryPath } from "@workspace/registry/connectors";

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
  const registryPath = getConnectorsRegistryPath();
  const publicDir = join(appRoot, "public", "connector-logos");
  ensureDir(publicDir);

  const connectors = readdirSync(registryPath, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith(".")
    )
    .map((d) => d.name);

  for (const id of connectors) {
    const base = join(registryPath, id, "_meta", "assets", "logo");
    const candidates = [
      { path: base + ".png", ext: ".png" },
      { path: base + ".svg", ext: ".svg" },
      { path: base + ".jpg", ext: ".jpg" },
      { path: base + ".jpeg", ext: ".jpeg" },
      { path: base + ".webp", ext: ".webp" },
    ];
    const found = candidates.find((c) => existsSync(c.path));
    if (!found) continue;

    const dest = join(publicDir, `${id}${found.ext}`);
    copyFileSync(found.path, dest);
  }
}

main();
